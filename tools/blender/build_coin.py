"""
Rebuilds the LocalBitcoins coin as real 3D geometry and renders an alpha turntable.

Everything is parametric, so the coin can be re-proportioned, re-coloured or re-lit by
editing the CONFIG block rather than remodelling. Nothing is traced from the original
PNG, so it stays crisp at any resolution.

    blender --background --python build_coin.py -- --still
    blender --background --python build_coin.py -- --turntable
    blender --background --python build_coin.py -- --still --save

Output lands in public/projects/hero-src/coin3d/.
"""

import bpy
import bmesh
import math
import os
import sys

# ----------------------------------------------------------------------------- config

OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "public", "projects", "hero-src", "coin3d",
)

COIN_RADIUS = 1.0
COIN_DEPTH = 0.16          # full thickness
RIM_BEVEL = 0.035          # softens the rim so it catches the key light
COIN_TILT = math.radians(22.0)   # leaned back, matching the original render

GLYPH_SCALE = 1.30         # B height relative to coin radius
GLYPH_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
TICK_SPAN = 0.13           # how far the ticks run above and below the B
EMBOSS_DEPTH = 0.045       # how deep the mark is stamped into the face
EMBOSS_BEVEL = 0.012

COIN_COLOR = (0xDF, 0x84, 0x2C)   # sampled from the original render
COIN_ROUGHNESS = 0.40
SURFACE_GRAIN = 0.55       # fine woven texture across the face
COIN_SPECULAR = 0.35

LOOP_FRAMES = 240          # 8s at 30fps, one full revolution
OSC_DEGREES = 24.0         # hero sway: half-angle of the gentle swing
FPS = 30
RES = 1400                 # square, plenty of headroom for a 2560 wide comp
SAMPLES_STILL = 96
SAMPLES_SEQUENCE = 160

# --------------------------------------------------------------------------- utilities


def srgb_to_linear(c):
    """Blender wants linear values; the sampled hex is sRGB."""
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def mesh_from_bmesh(name, bm):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


# ------------------------------------------------------------------------ glyph pieces
#
# The B is assembled from parametric primitives rather than booleans: a stem, two
# half-annulus bowls whose arcs start and end flush against the stem, and four ticks.
# No boolean modifiers means no degenerate geometry to debug.


def add_box(bm, x0, x1, y0, y1, z0, z1):
    verts = [
        bm.verts.new((x, y, z))
        for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)
    ]
    bm.verts.ensure_lookup_table()
    # cube faces by index into the 8 corners generated above
    idx = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1),
           (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    for a, b, c, d in idx:
        bm.faces.new((verts[a], verts[b], verts[c], verts[d]))


def add_arc_band(bm, cx, cy, rx, ry, width, a0, a1, z0, z1, segments=48):
    """A thick elliptical arc, extruded in Z. Forms one bowl of the B."""
    outer, inner = [], []
    for i in range(segments + 1):
        t = a0 + (a1 - a0) * i / segments
        ct, st = math.cos(t), math.sin(t)
        outer.append((cx + rx * ct, cy + ry * st))
        inner.append((cx + (rx - width) * ct, cy + (ry - width) * st))

    top_o = [bm.verts.new((x, y, z1)) for x, y in outer]
    top_i = [bm.verts.new((x, y, z1)) for x, y in inner]
    bot_o = [bm.verts.new((x, y, z0)) for x, y in outer]
    bot_i = [bm.verts.new((x, y, z0)) for x, y in inner]

    for i in range(segments):
        bm.faces.new((top_o[i], top_o[i + 1], top_i[i + 1], top_i[i]))
        bm.faces.new((bot_i[i], bot_i[i + 1], bot_o[i + 1], bot_o[i]))
        bm.faces.new((bot_o[i], bot_o[i + 1], top_o[i + 1], top_o[i]))
        bm.faces.new((top_i[i], top_i[i + 1], bot_i[i + 1], bot_i[i]))

    # cap the two open ends of the arc
    for o, i_, bo, bi in ((top_o[0], top_i[0], bot_o[0], bot_i[0]),
                          (top_i[-1], top_o[-1], bot_i[-1], bot_o[-1])):
        bm.faces.new((o, i_, bi, bo))


def normalise(obj, height=1.0, depth=None):
    """Scale and centre a mesh into glyph units: given height, centred on x and y,
    sitting on z = 0."""
    xs = [v.co.x for v in obj.data.vertices]
    ys = [v.co.y for v in obj.data.vertices]
    zs = [v.co.z for v in obj.data.vertices]
    scale = height / (max(ys) - min(ys))
    cx, cy = (max(xs) + min(xs)) / 2.0, (max(ys) + min(ys)) / 2.0
    zrange = max(zs) - min(zs)
    zscale = (depth / zrange) if (depth and zrange) else scale
    for v in obj.data.vertices:
        v.co.x = (v.co.x - cx) * scale
        v.co.y = (v.co.y - cy) * scale
        v.co.z = (v.co.z - min(zs)) * zscale


def build_b_glyph():
    """The B taken from a real typeface rather than constructed from arcs.

    Building it from a stem and two half-annuli gave flat sided bowls and thin
    crescent counters, which reads as a different letter entirely. A grotesque B
    carries the right bowl shape, stroke modulation and counter size for free.
    """
    curve = bpy.data.curves.new("Bcurve", type="FONT")
    curve.body = "B"
    curve.font = bpy.data.fonts.load(GLYPH_FONT)
    curve.extrude = EMBOSS_DEPTH / 2.0
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"

    obj = bpy.data.objects.new("Cut_B", curve)
    bpy.context.collection.objects.link(obj)

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)

    normalise(obj, height=1.0, depth=EMBOSS_DEPTH)
    return obj


def glyph_pieces():
    """The mark, as separate closed solids.

    They overlap by design. Kept in one mesh the boolean solver treats the shared
    volumes as self-intersections and cancels them out, leaving hollow outlines, so
    each piece stays its own cutter instead: stacked DIFFERENCE modifiers subtract
    the union, and subtracting the same volume twice is harmless.
    """
    pieces = [build_b_glyph()]

    # The single vertical stroke that makes a B a bitcoin B, centred on the
    # glyph and running out above and below it.
    z0, z1 = 0.0, EMBOSS_DEPTH
    for i, (x0, x1) in enumerate(((-0.07, 0.07),)):
        for side, (y0, y1) in (("top", (0.42, 0.5 + TICK_SPAN)),
                               ("bot", (-0.5 - TICK_SPAN, -0.42))):
            bm = bmesh.new()
            add_box(bm, x0, x1, y0, y1, z0, z1)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            pieces.append(mesh_from_bmesh("Cut_tick_%d_%s" % (i, side), bm))
    return pieces


def build_coin():
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=192, radius=COIN_RADIUS, depth=COIN_DEPTH, location=(0, 0, 0)
    )
    coin = bpy.context.object
    coin.name = "Coin"

    bev = coin.modifiers.new("Rim", "BEVEL")
    bev.width = RIM_BEVEL
    bev.segments = 10
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(40)

    # Smooth the rim but keep the two faces flat. use_auto_smooth was removed in 4.1,
    # so this is the operator form; older builds fall back to the mesh flag.
    if hasattr(bpy.ops.object, "shade_auto_smooth"):
        bpy.ops.object.shade_auto_smooth(angle=math.radians(40))
    else:
        bpy.ops.object.shade_smooth()
        coin.data.use_auto_smooth = True
    return coin


def place_glyphs(coin):
    """Stamp the mark into both faces, so the back reads correctly as it turns."""
    cutters = []
    for sign in (1, -1):
        for piece in glyph_pieces():
            piece.name = "%s_%s" % (piece.name, "front" if sign > 0 else "back")

            # The back copy flips about Y, not X: that mirrors x and reverses the
            # extrusion, which reads as a correct B from behind. Flipping about X
            # mirrors the glyph and the back of the coin comes out backwards.
            piece.rotation_euler = (0.0, 0.0, 0.0) if sign > 0 else (0.0, math.pi, 0.0)

            # The cutter is three times deeper than the recess and sunk so it starts
            # below the surface and pokes out above: coplanar faces are where
            # boolean solvers fall over.
            piece.scale = (GLYPH_SCALE, GLYPH_SCALE, 3.0)
            piece.location = (0.0, 0.0, sign * (COIN_DEPTH / 2.0 - EMBOSS_DEPTH))

            b = piece.modifiers.new("Soften", "BEVEL")
            b.width = EMBOSS_BEVEL
            b.segments = 4
            b.limit_method = "ANGLE"
            b.angle_limit = math.radians(50)

            cut = coin.modifiers.new("Deboss_%02d" % len(cutters), "BOOLEAN")
            cut.operation = "DIFFERENCE"
            cut.object = piece
            cut.solver = "EXACT"

            piece.hide_render = True
            piece.hide_viewport = True
            piece.parent = coin
            cutters.append(piece)
    return cutters


def build_material():
    mat = bpy.data.materials.new("CoinOrange")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    rgb = tuple(srgb_to_linear(c) for c in COIN_COLOR)
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = COIN_ROUGHNESS
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = COIN_SPECULAR
    elif "Specular" in bsdf.inputs:
        bsdf.inputs["Specular"].default_value = COIN_SPECULAR
    bsdf.inputs["Metallic"].default_value = 0.0

    # Fine woven grain across the surface. The original render has a visible
    # texture; without it the coin reads as plastic rather than struck metal.
    nt = mat.node_tree
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 240.0
    noise.inputs["Detail"].default_value = 4.0
    noise.inputs["Roughness"].default_value = 0.55
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = SURFACE_GRAIN
    bump.inputs["Distance"].default_value = 0.012
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def build_lighting():
    """Key from the upper left, matching the warm rim on the original render."""
    def lamp(name, kind, energy, loc, size=5.0, rot=(0, 0, 0)):
        data = bpy.data.lights.new(name, kind)
        data.energy = energy
        if kind == "AREA":
            data.size = size
        obj = bpy.data.objects.new(name, data)
        obj.location = loc
        obj.rotation_euler = rot
        bpy.context.collection.objects.link(obj)
        return obj

    lamp("Key", "AREA", 1150.0, (-3.2, -2.4, 3.6), size=6.0,
         rot=(math.radians(40), 0, math.radians(-38)))
    lamp("Fill", "AREA", 130.0, (3.4, -2.0, 0.6), size=7.0,
         rot=(math.radians(80), 0, math.radians(58)))
    lamp("Rim", "AREA", 620.0, (1.6, 3.4, 2.2), size=4.0,
         rot=(math.radians(-50), 0, math.radians(160)))


def build_camera():
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 85.0
    cam = bpy.data.objects.new("Camera", cam_data)
    cam.location = (0.0, -6.2, 0.0)
    cam.rotation_euler = (math.radians(90), 0.0, 0.0)
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    return cam


def eevee_engine_name():
    """EEVEE was renamed between 4.x and 5.x; pick whichever this build exposes."""
    items = bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items.keys()
    for name in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        if name in items:
            return name
    return "CYCLES"


def setup_render(sequence, use_cycles):
    scene = bpy.context.scene

    if use_cycles:
        scene.render.engine = "CYCLES"
        scene.cycles.samples = SAMPLES_SEQUENCE if sequence else SAMPLES_STILL
        scene.cycles.use_denoising = True
        # prefer GPU when one is available, fall back silently
        try:
            prefs = bpy.context.preferences.addons["cycles"].preferences
            prefs.compute_device_type = "METAL"
            prefs.get_devices()
            for dev in prefs.devices:
                dev.use = True
            scene.cycles.device = "GPU"
        except Exception:
            pass
    else:
        scene.render.engine = eevee_engine_name()
        for attr, value in (("taa_render_samples", 64), ("use_raytracing", True)):
            if hasattr(scene.eevee, attr):
                setattr(scene.eevee, attr, value)

    # The original artwork is flat and saturated. AgX, the default since 4.0, pulls
    # colour out of it and reads as washed next to the phone PNG.
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"

    scene.render.resolution_x = RES
    scene.render.resolution_y = RES
    scene.render.fps = FPS
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 20


def action_fcurves(action):
    """Blender 4.4 moved f-curves inside layered actions; support both shapes."""
    legacy = getattr(action, "fcurves", None)
    if legacy:
        return list(legacy)
    found = []
    for layer in getattr(action, "layers", []):
        for strip in layer.strips:
            for bag in getattr(strip, "channelbags", []):
                found.extend(bag.fcurves)
    return found


def animate_sway(pivot):
    """Gentle sine swing for the hero. A driver rather than keyframes: a sine's
    value and velocity match at both ends of the cycle, so the loop is seamless by
    construction and there is no interpolation to get wrong."""
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = LOOP_FRAMES

    pivot.rotation_mode = "XYZ"
    fcurve = pivot.driver_add("rotation_euler", 2)
    drv = fcurve.driver
    drv.type = "SCRIPTED"
    drv.expression = "radians(%f) * sin(2 * pi * (frame - 1) / %d)" % (
        OSC_DEGREES, LOOP_FRAMES)
    print("SWAY: +/-%.1f degrees over %d frames" % (OSC_DEGREES, LOOP_FRAMES))


def animate_turntable(pivot):
    """One full revolution about the vertical axis, so frame 0 and frame N match."""
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = LOOP_FRAMES

    pivot.rotation_mode = "XYZ"
    for frame, angle in ((1, 0.0), (LOOP_FRAMES + 1, math.tau)):
        pivot.rotation_euler = (0.0, 0.0, angle)
        pivot.keyframe_insert("rotation_euler", frame=frame, index=2)

    # A constant rate is what makes the loop seamless. Keys default to bezier, which
    # eases in and out and leaves the loop stuttering at the seam, so force linear.
    # The preference for this is not honoured in background mode, so set the keys
    # directly and fail loudly rather than silently easing.
    curves = action_fcurves(pivot.animation_data.action)
    if not curves:
        raise RuntimeError("no f-curves found on the turntable action")
    for fc in curves:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"
        fc.update()

    # Sanity probe: with two linear keys these must land on exact quarter turns.
    probe = [(f, round(math.degrees(curves[0].evaluate(f)), 2))
             for f in (1, LOOP_FRAMES // 4 + 1, LOOP_FRAMES // 2 + 1, LOOP_FRAMES)]
    print("ROTATION PROBE (frame, degrees): %s" % probe)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    sequence = "--turntable" in argv
    save_blend = "--save" in argv
    # not "--cycles": blender's own cycles addon claims any --cycles* argument,
    # even after the -- separator, and aborts on the ambiguity.
    use_cycles = "--raytrace" in argv
    sway = "--oscillate" in argv
    sequence = sequence or sway
    # --angle N renders a single still with the coin turned N degrees, for checking
    # a specific point of the rotation without rendering the whole sequence.
    angle = 0.0
    if "--angle" in argv:
        angle = float(argv[argv.index("--angle") + 1])

    clear_scene()
    os.makedirs(OUT_DIR, exist_ok=True)

    coin = build_coin()
    glyphs = place_glyphs(coin)

    mat = build_material()
    coin.data.materials.append(mat)

    # The coin leans back, and a parent empty carries the spin so the lean is preserved.
    coin.rotation_euler = (math.pi / 2 - COIN_TILT, 0.0, 0.0)
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    pivot = bpy.context.object
    pivot.name = "TurntablePivot"
    pivot.rotation_euler = (0.0, 0.0, math.radians(angle))
    coin.parent = pivot

    if "--stats" in argv:
        dg = bpy.context.evaluated_depsgraph_get()
        ev = coin.evaluated_get(dg).to_mesh()
        print("STATS coin evaluated: verts=%d faces=%d" % (len(ev.vertices), len(ev.polygons)))
        print("STATS modifiers: %s" % [(m.name, m.type) for m in coin.modifiers])
        for c in glyphs[:2]:
            cev = c.evaluated_get(dg).to_mesh()
            print("STATS cutter %s: verts=%d faces=%d hide_vp=%s" % (
                c.name, len(cev.vertices), len(cev.polygons), c.hide_viewport))

    build_lighting()
    build_camera()
    setup_render(sequence, use_cycles)

    if sequence:
        if sway:
            animate_sway(pivot)
        else:
            animate_turntable(pivot)
        if "--check" in argv:
            print("CHECK ONLY, no frames rendered")
            return
        sub = "hero" if sway else ""
        out = os.path.join(OUT_DIR, sub) if sub else OUT_DIR
        os.makedirs(out, exist_ok=True)
        bpy.context.scene.render.filepath = os.path.join(
            out, "sway_" if sway else "coin_")
        bpy.ops.render.render(animation=True)
        print("SEQUENCE WRITTEN: %s" % out)
    else:
        bpy.context.scene.render.filepath = os.path.join(
            OUT_DIR, "coin_preview_%03d.png" % int(angle))
        bpy.ops.render.render(write_still=True)
        print("STILL WRITTEN: %s" % bpy.context.scene.render.filepath)

    if save_blend:
        blend_path = os.path.join(OUT_DIR, "coin.blend")
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        print("BLEND WRITTEN: %s" % blend_path)


if __name__ == "__main__":
    main()
