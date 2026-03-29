import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const EyeCursorSection = () => {
  const leftEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const leftEyelidRef = useRef(null);
  const leftBrowRef = useRef(null);

  const rightEyeRef = useRef(null);
  const rightPupilRef = useRef(null);
  const rightEyelidRef = useRef(null);
  const rightBrowRef = useRef(null);

  const eyes = [
    { eye: leftEyeRef, pupil: leftPupilRef, eyelid: leftEyelidRef, brow: leftBrowRef },
    { eye: rightEyeRef, pupil: rightPupilRef, eyelid: rightEyelidRef, brow: rightBrowRef },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      eyes.forEach(({ eye, pupil, eyelid, brow }, idx) => {
        if (!eye.current || !pupil.current || !eyelid.current || !brow.current) return;
        
        const rect = eye.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(14, Math.hypot(dx, dy) / 8);

        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;

        // Animate pupil following cursor
        gsap.to(pupil.current, {
          x,
          y,
          duration: 0.25,
          ease: "power2.out",
        });

        // Animate eyebrow: raise/lower and rotate based on cursor Y and X
        const browRaise = Math.max(-8, Math.min(8, (centerY - clientY) / 10));
        const browTilt = (clientX - centerX) / 40;
        gsap.to(brow.current, {
          y: browRaise,
          rotate: idx === 0 ? -12 + browTilt : 12 + browTilt,
          duration: 0.3,
          ease: "power2.out",
        });

        // Close eyes when hovering over them directly
        const isHovering =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        gsap.to(eyelid.current, {
          height: isHovering ? "100%" : "0%",
          duration: 0.25,
          ease: "power1.inOut",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let blinkTimeout;
    function blink() {
      eyes.forEach(({ eyelid }) => {
        if (!eyelid.current) return;
        gsap.to(eyelid.current, {
          height: "100%",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        });
      });
      blinkTimeout = setTimeout(blink, 2500 + Math.random() * 3500);
    }
    blinkTimeout = setTimeout(blink, 2000 + Math.random() * 2000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center w-full pointer-events-none"
    >
      {/* Eyebrows Container */}
      <div className="relative flex justify-center items-center gap-5 w-full h-8 mb-1 sm:mb-2 pointer-events-auto scale-90 sm:scale-100">
        <div className="relative w-16 h-full flex justify-center items-center">
          <div
            ref={leftBrowRef}
            className="w-12 h-1.5 rounded-full absolute transform-gpu"
            style={{
              backgroundColor: "var(--vl)",
              boxShadow: "0 0 10px rgba(168,85,247,0.4)",
              transform: "rotate(-12deg)",
            }}
          ></div>
        </div>
        <div className="relative w-16 h-full flex justify-center items-center">
          <div
            ref={rightBrowRef}
            className="w-12 h-1.5 rounded-full absolute transform-gpu"
            style={{
              backgroundColor: "var(--vl)",
              boxShadow: "0 0 10px rgba(168,85,247,0.4)",
              transform: "rotate(12deg)",
            }}
          ></div>
        </div>
      </div>

      {/* Eyes Container */}
      <div className="flex justify-center items-center gap-5 w-full pointer-events-auto scale-90 sm:scale-100">
        {eyes.map(({ eye, pupil, eyelid }, i) => (
          <div
            key={i}
            ref={eye}
            className="w-16 h-16 rounded-full flex items-center justify-center border relative overflow-hidden backdrop-blur-[2px]"
            style={{
              backgroundColor: "var(--bg2)",
              borderColor: "var(--border)",
              boxShadow: "0 0 20px rgba(147,51,234,0.08)",
            }}
          >
            {/* Eyelid */}
            <div
              ref={eyelid}
              className="absolute top-0 left-0 w-full h-0 z-20 rounded-b-full transition-all duration-300 ease-out border-b-2"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--vl)",
                borderBottomLeftRadius: "100% 60%",
                borderBottomRightRadius: "100% 60%",
                pointerEvents: "none",
              }}
            ></div>
            
            {/* Pupil */}
            <motion.div
              ref={pupil}
              className="w-5 h-5 rounded-full z-10"
              style={{
                backgroundColor: "var(--vl)",
                boxShadow: "0 0 15px var(--vl), inset 0 0 5px rgba(255,255,255,0.9)",
              }}
            ></motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EyeCursorSection;

