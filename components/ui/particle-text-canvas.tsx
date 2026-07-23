"use client";

import { useRef, useEffect } from "react";

interface Mouse {
  x: number;
  y: number;
  radius: number;
}

const ParticleText = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Initialised off-screen so particles rest in the text shape until the cursor moves near.
  const mouse = useRef<Mouse>({ x: -1000, y: -1000, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Alias with a non-null type so the narrowing holds inside the Particle class methods below.
    const context: CanvasRenderingContext2D = ctx;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray: Particle[] = [];
    let animationFrameId = 0;

    class Particle {
      x: number;
      y: number;
      color: string;
      size: number;
      baseX: number;
      baseY: number;
      density: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 2;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 40 + 5;
      }

      draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.closePath();
        context.fill();
      }

      update() {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        let force = (mouse.current.radius - distance) / mouse.current.radius;
        if (force < 0) force = 0;

        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        if (distance < mouse.current.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const dxBase = this.x - this.baseX;
            this.x -= dxBase / 10;
          }
          if (this.y !== this.baseY) {
            const dyBase = this.y - this.baseY;
            this.y -= dyBase / 10;
          }
        }
      }
    }

    function init() {
      if (!canvas || !ctx) return;
      particlesArray = [];
      const text = "Vibe";
      const fontSize = 200;
      const textX = canvas.width / 2;
      const textY = canvas.height / 2;

      ctx.font = `bold ${fontSize}px "Arial Black", Gadget, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0.2, "#41d1ff");
      gradient.addColorStop(0.5, "#41a9ff");
      gradient.addColorStop(0.8, "#61dafb");
      ctx.fillStyle = gradient;

      ctx.fillText(text, textX, textY);
      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < textCoordinates.height; y += 4) {
        for (let x = 0; x < textCoordinates.width; x += 4) {
          const alphaIndex = y * 4 * textCoordinates.width + x * 4 + 3;
          if (textCoordinates.data[alphaIndex] > 128) {
            const r = textCoordinates.data[alphaIndex - 3];
            const g = textCoordinates.data[alphaIndex - 2];
            const b = textCoordinates.data[alphaIndex - 1];
            const color = `rgb(${r},${g},${b})`;
            particlesArray.push(new Particle(x, y, color));
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.draw();
        p.update();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0f18", overflow: "hidden" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ParticleText;
