import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";
import { useIsMobile } from "../hooks/useIsMobile";

const SPACING = 45;

export default function PerfectInteractiveGrid() {
  const isMobile = useIsMobile();
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    let points = [];
    let ripples = [];

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      points = [];
      for (let x = 0; x <= w + SPACING; x += SPACING) {
        for (let y = 0; y <= h + SPACING; y += SPACING) {
          points.push({ ox: x, oy: y, x: x, y: y, vx: 0, vy: 0 });
        }
      }
    };
    
    init();

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onClick = (e) => {
      // Add a powerful repelling ripple shockwave
      ripples.push({ x: e.clientX, y: e.clientY, radius: 0, life: 1 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    window.addEventListener("resize", init);

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      const mx = mouse.current.x;
      const my = mouse.current.y;
      
      // Draw ultra-subtle ambient cursor glow gradient overlay
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 240);
      const isLight = theme === 'light';
      grad.addColorStop(0, isLight ? 'rgba(147, 51, 234, 0.02)' : 'rgba(168, 85, 247, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.fillRect(mx - 240, my - 240, 480, 480);

      // Ultra-low ambient theme colors
      const baseDotColor = isLight ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.015)";
      const activeDotColor = isLight ? "rgba(147, 51, 234, 0.12)" : "rgba(168, 85, 247, 0.15)";
      const intenseDotColor = isLight ? "rgba(147, 51, 234, 0.25)" : "rgba(192, 132, 252, 0.28)";

      // Update and draw ripples with whisper-thin opacity
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 7;
        r.life -= 0.02;
        if (r.life <= 0) { ripples.splice(i, 1); continue; }
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${r.life * 0.08})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Mouse interaction
        const dx = mx - p.ox;
        const dy = my - p.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let tx = p.ox;
        let ty = p.oy;
        
        if (dist < 140) {
          const force = (140 - dist) / 140;
          tx = p.ox + dx * force * 0.14;
          ty = p.oy + dy * force * 0.14;
        }

        // Ripple interaction
        for (const r of ripples) {
          const rdx = r.x - p.ox;
          const rdy = r.y - p.oy;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          if (Math.abs(rdist - r.radius) < 25) {
            const rforce = (25 - Math.abs(rdist - r.radius)) / 25;
            tx -= (rdx / rdist) * rforce * 10 * r.life;
            ty -= (rdy / rdist) * rforce * 10 * r.life;
          }
        }
        
        p.vx += (tx - p.x) * 0.08;
        p.vy += (ty - p.y) * 0.08;
        p.vx *= 0.85;
        p.vy *= 0.85;
        
        p.x += p.vx;
        p.y += p.vy;
        
        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        const isActive = speed > 0.25 || dist < 140;
        
        ctx.beginPath();
        if (isActive) {
           ctx.arc(p.x, p.y, speed > 0.8 ? 1.4 : 1.0, 0, Math.PI * 2);
           ctx.fillStyle = speed > 0.8 ? intenseDotColor : activeDotColor;
        } else {
           ctx.arc(p.x, p.y, 0.65, 0, Math.PI * 2);
           ctx.fillStyle = baseDotColor; 
        }
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", init);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isMobile) return null;

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}