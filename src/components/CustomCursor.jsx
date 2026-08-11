import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useCursor } from '../hooks/useCursor';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);
  const { hoverType } = useCursor();
  const [isXRay, setIsXRay] = useState(false);

  // Reference for storing mouse position to use inside requestAnimationFrame
  const mouse = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Signature Feature: X-Ray trigger
    const onKeyDown = (e) => { if (e.key === 'Shift') setIsXRay(true); };
    const onKeyUp = (e) => { if (e.key === 'Shift') setIsXRay(false); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Fast physical dot
    const xToDot = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });
    
    // Sluggish rings
    const xToRing1 = gsap.quickTo(ringRef.current, "x", { duration: 0.2, ease: "power3" });
    const yToRing1 = gsap.quickTo(ringRef.current, "y", { duration: 0.2, ease: "power3" });
    const xToRing2 = gsap.quickTo(ring2Ref.current, "x", { duration: 0.4, ease: "power2.out" });
    const yToRing2 = gsap.quickTo(ring2Ref.current, "y", { duration: 0.4, ease: "power2.out" });

    // Very slow ambient glow
    const xToGlow = gsap.quickTo(glowRef.current, "x", { duration: 1.2, ease: "power2.out" });
    const yToGlow = gsap.quickTo(glowRef.current, "y", { duration: 1.2, ease: "power2.out" });

    let rafId = null;
    let sparks = [];

    // Canvas preparation
    const canvas = canvasRef.current;
    let ctx;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
    }

    const onResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', onResize);

    const render = () => {
      // Set CSS variables for InteractiveGrid to use
      document.documentElement.style.setProperty('--mouse-x', `${mouse.current.x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouse.current.y}px`);
      
      // Update GSAP
      xToDot(mouse.current.x);
      yToDot(mouse.current.y);
      xToRing1(mouse.current.x);
      yToRing1(mouse.current.y);
      xToRing2(mouse.current.x);
      yToRing2(mouse.current.y);
      xToGlow(mouse.current.x);
      yToGlow(mouse.current.y);

      // Particle Trail Logic
      // if (ctx) {
      //   const dx = mouse.current.x - mouse.current.lastX;
      //   const dy = mouse.current.y - mouse.current.lastY;
      //   const speed = Math.sqrt(dx * dx + dy * dy);

      //   if (speed > 2 && Math.random() < 0.5) {
      //     sparks.push({
      //       x: mouse.current.x,
      //       y: mouse.current.y,
      //       vx: (Math.random() - 0.5) * 2 - (dx * 0.05),
      //       vy: (Math.random() - 0.5) * 2 - (dy * 0.05) - 1, // slight upwards drift
      //       life: 1,
      //       color: ['#c084fc', '#a855f7', '#d8b4fe', '#ffffff'][Math.floor(Math.random() * 4)]
      //     });
      //   }
        
      //   mouse.current.lastX = mouse.current.x;
      //   mouse.current.lastY = mouse.current.y;

      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      //   for (let i = sparks.length - 1; i >= 0; i--) {
      //     let s = sparks[i];
      //     s.x += s.vx;
      //     s.y += s.vy;
      //     s.life -= 0.035;
      //     if (s.life <= 0) { sparks.splice(i, 1); continue; }
      //     ctx.beginPath();
      //     ctx.arc(s.x, s.y, s.life * 2.5, 0, Math.PI * 2);
      //     ctx.fillStyle = s.color;
      //     ctx.shadowBlur = 10;
      //     ctx.shadowColor = s.color;
      //     ctx.globalAlpha = s.life;
      //     ctx.fill();
      //   }
      //   ctx.globalAlpha = 1;
      //   ctx.shadowBlur = 0;
      // }

      // Loop
      rafId = requestAnimationFrame(render);
    };

    // Sticking to lightweight mouse move event listener
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    
    // Start RAF loop
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" 
      />
      {/* Signature X-Ray Lens */}
      <div 
        className="pointer-events-none fixed inset-0 z-[8000] hidden md:block transition-opacity duration-300"
        style={{
          opacity: isXRay ? 1 : 0,
          backdropFilter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1)',
          WebkitBackdropFilter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1)',
          maskImage: `radial-gradient(circle 220px at var(--mouse-x) var(--mouse-y), black 40%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 220px at var(--mouse-x) var(--mouse-y), black 40%, transparent 100%)`,
        }}
      />
      <div 
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] -ml-[200px] -mt-[200px] bg-vl/5 blur-[140px] rounded-full z-0 hidden md:block will-change-transform"
      />
      <div className="pointer-events-none fixed inset-0 z-[10000] mix-blend-difference hidden md:block">
        <div 
          ref={dotRef}
          className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 bg-white rounded-full transition-opacity duration-300 will-change-transform ${
            hoverType === 'pointer' ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div 
          ref={ringRef}
          className={`fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center origin-center will-change-transform transition-[width,height,transform,background-color,border-color,border-radius] duration-300 ease-out ${
            hoverType === 'pointer' 
              ? 'w-10 h-10 bg-white scale-[1.5] rounded-full' 
              : hoverType === 'project'
              ? 'w-12 h-12 bg-transparent border border-white scale-[1.5] rounded-[8px]'
              : 'w-10 h-10 border border-white/40 rounded-full scale-100'
          }`}
        />
        <div 
          ref={ring2Ref}
          className={`fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center opacity-30 origin-center will-change-transform transition-[width,height,transform,background-color,border-color] duration-700 ease-out ${
            hoverType === 'pointer' 
              ? 'w-10 h-10 bg-white scale-[2] rounded-full' 
              : 'w-10 h-10 border border-white/20 rounded-full scale-125'
          }`}
        />
      </div>
    </>
  );
}
