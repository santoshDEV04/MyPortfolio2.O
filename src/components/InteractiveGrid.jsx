import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 40;

export default function PerfectInteractiveGrid() {
  const [ripples, setRipples] = useState([]);
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    const root = document.documentElement;

    const onMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position RELATIVE to the grid container
      mouse.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const onClick = (e) => {
      const id = crypto.randomUUID();
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 1000);
    };

    const animate = () => {
      // Smooth interpolation
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.15;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.15;

      // Update CSS Variables locally to this container
      if (containerRef.current) {
        containerRef.current.style.setProperty("--m-x", `${smooth.current.x}px`);
        containerRef.current.style.setProperty("--m-y", `${smooth.current.y}px`);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      <style>{`
        .grid-base {
          position: absolute;
          inset: 0;
          /* Center the grid points so 0,0 is a dot */
          background-image: radial-gradient(circle at 1px 1px, currentColor 1.5px, transparent 0);
          background-size: ${GRID_SIZE}px ${GRID_SIZE}px;
          background-position: -0.75px -0.75px; 
          opacity: 0.1;
        }

        .grid-reveal {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, currentColor 2px, transparent 0);
          background-size: ${GRID_SIZE}px ${GRID_SIZE}px;
          background-position: -1px -1px;
          
          /* The Mask: Correctly centered on the mouse variables */
          -webkit-mask-image: radial-gradient(
            circle 200px at var(--m-x) var(--m-y), 
            black 0%, 
            rgba(0,0,0,0.4) 50%, 
            transparent 100%
          );
          mask-image: radial-gradient(
            circle 200px at var(--m-x) var(--m-y), 
            black 0%, 
            rgba(0,0,0,0.4) 50%, 
            transparent 100%
          );
          opacity: 0.8;
        }

        .cursor-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle 400px at var(--m-x) var(--m-y), 
            rgba(139, 92, 246, 0.1), 
            transparent 80%
          );
        }

        @keyframes ig-ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }

        .ripple {
          position: fixed;
          border: 1.5px solid rgba(139, 92, 246, 0.5);
          border-radius: 50%;
          animation: ig-ripple 0.8s cubic-bezier(0.1, 0.5, 0.5, 1) forwards;
        }
      `}</style>

      {/* Layering order ensures glow is behind the sharp dots */}
      <div className="cursor-glow" />
      <div className="grid-base" />
      <div className="grid-reveal" />

      {ripples.map((r) => (
        <div 
          key={r.id} 
          className="ripple" 
          style={{ left: r.x, top: r.y, width: 450, height: 450 }} 
        />
      ))}
    </div>
  );
}