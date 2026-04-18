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
      
      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 10;
        r.life -= 0.025;
        if (r.life <= 0) { ripples.splice(i, 1); continue; }
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${r.life * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      
      // Determine theme colors dynamically inside RAF
      const isLight = theme === 'light';
      const baseDotColor = isLight ? "rgba(0, 0, 0, 0.01)" : "rgba(200, 200, 255, 0.1)";
      const activeDotColor = isLight ? "rgba(147, 51, 234, 0.08)" : "rgba(168, 85, 247, 0.6)";
      const intenseDotColor = isLight ? "#9333ea" : "#a855f7";
      const glowCenter = isLight ? "rgba(147, 51, 234, 0.05)" : "rgba(139, 92, 246, 0.12)";
      
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Mouse interaction
        const dx = mx - p.ox;
        const dy = my - p.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let tx = p.ox;
        let ty = p.oy;
        
        if (dist < 180) {
          const force = (180 - dist) / 180;
          // pull slightly towards mouse (magnetic effect)
          tx = p.ox + dx * force * 0.25;
          ty = p.oy + dy * force * 0.25;
        }

        // Ripple interaction
        for (const r of ripples) {
          const rdx = r.x - p.ox;
          const rdy = r.y - p.oy;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          // if the ripple wave front is hitting this point, push it out
          if (Math.abs(rdist - r.radius) < 35) {
            const rforce = (35 - Math.abs(rdist - r.radius)) / 35;
            tx -= (rdx / rdist) * rforce * 18 * r.life;
            ty -= (rdy / rdist) * rforce * 18 * r.life;
          }
        }
        
        p.vx += (tx - p.x) * 0.12; // Spring
        p.vy += (ty - p.y) * 0.12;
        p.vx *= 0.82; // Friction
        p.vy *= 0.82;
        
        p.x += p.vx;
        p.y += p.vy;
        
        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        const isActive = speed > 0.4 || dist < 180;
        
        ctx.beginPath();
        if (isActive) {
           ctx.arc(p.x, p.y, speed > 0.8 ? 2 : 1.5, 0, Math.PI * 2);
           ctx.fillStyle = speed > 0.8 ? intenseDotColor : activeDotColor;
        } else {
           // draw standard faint cross or dot
           ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
           ctx.fillStyle = baseDotColor; 
        }
        ctx.fill();
      }
      
      // Draw smooth cursor glow gradient overlay
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 350);
      grad.addColorStop(0, glowCenter);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.globalCompositeOperation = isLight ? 'multiply' : 'lighter';
      ctx.fillStyle = grad;
      ctx.fillRect(mx - 350, my - 350, 700, 700);
      ctx.globalCompositeOperation = 'source-over';

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