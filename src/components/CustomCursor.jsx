import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor } from '../hooks/useCursor';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  const glowRef = useRef(null);
  const { hoverType } = useCursor();

  // Reference for storing mouse position to use inside requestAnimationFrame
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

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
      cancelAnimationFrame(rafId);
    };
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      <div 
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] -ml-[250px] -mt-[250px] bg-vl/10 blur-[120px] rounded-full z-0 hidden md:block will-change-transform"
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
