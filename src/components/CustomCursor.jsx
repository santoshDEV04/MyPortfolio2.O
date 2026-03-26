import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor } from '../hooks/useCursor';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);
  const glowRef = useRef(null);
  const { hoverType } = useCursor();

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

    const moveCursor = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing1(e.clientX);
      yToRing1(e.clientY);
      xToRing2(e.clientX);
      yToRing2(e.clientY);
      xToGlow(e.clientX);
      yToGlow(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <>
      <div 
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] -ml-[250px] -mt-[250px] bg-vl/10 blur-[120px] rounded-full z-0 hidden md:block"
      />
      <div className="pointer-events-none fixed inset-0 z-[10000] mix-blend-difference hidden md:block">
        <div 
          ref={dotRef}
          className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 bg-white rounded-full transition-opacity duration-300 ${
            hoverType === 'pointer' ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div 
          ref={ringRef}
          className={`fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center transition-all duration-300 ease-out origin-center ${
            hoverType === 'pointer' 
              ? 'w-10 h-10 bg-white scale-[1.5] rounded-full' 
              : hoverType === 'project'
              ? 'w-12 h-12 bg-transparent border border-white scale-[1.5] rounded-[8px]'
              : 'w-10 h-10 border border-white/40 rounded-full scale-100'
          }`}
        />
        <div 
          ref={ring2Ref}
          className={`fixed top-0 left-0 -ml-5 -mt-5 flex items-center justify-center transition-all duration-700 ease-out origin-center opacity-30 ${
            hoverType === 'pointer' 
              ? 'w-10 h-10 bg-white scale-[2] rounded-full' 
              : 'w-10 h-10 border border-white/20 rounded-full scale-125'
          }`}
        />
      </div>
    </>
  );
}
