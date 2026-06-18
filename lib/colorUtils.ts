/** Returns '#FFFFFF' or '#0A0A0A' — whichever has better contrast against the given color. */
export function getContrastColor(color: string): "#FFFFFF" | "#0A0A0A" {
  let r = 0, g = 0, b = 0;
  if (color.startsWith("#") && color.length >= 7) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    const m = color.match(/\d+/g);
    if (m && m.length >= 3) { r = +m[0]; g = +m[1]; b = +m[2]; }
  }
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#0A0A0A" : "#FFFFFF";
}

/** Extracts the average (dominant) color from an image URL via canvas. Returns a hex string. */
export function extractImageColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 40;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("#888888");
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 200) continue; // skip near-transparent pixels
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
      if (n === 0) return resolve("#888888");
      const toHex = (v: number) => Math.round(v / n).toString(16).padStart(2, "0");
      resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
    };
    img.onerror = () => resolve("#888888");
    img.src = imageUrl;
  });
}
