import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTransition, PAGE_NAMES } from '../context/TransitionContext';

// ─── Timing & Easing ───────────────────────────────────────────────────────
const T_DURATION = 0.8;
const EASE = [0.76, 0, 0.24, 1];

export default function PageTransition({ children }) {
  const location = useLocation();
  const { pendingLabel } = useTransition();
  
  // Prefer the pending label (target) over the current pathname (source)
  const label = pendingLabel || PAGE_NAMES[location.pathname] || 'SANTOSH';

  return (
    <>
      {/* ── Diagonal Overlay 1 (Violet) ── */}
      <motion.div
        className="fixed inset-0 z-[9991] bg-vl pointer-events-none"
        initial={{ skewY: 12, y: "0%" }}
        animate={{ y: "-160%", skewY: 12 }}
        exit={{ y: "0%", skewY: 12 }}
        transition={{ duration: T_DURATION, ease: EASE }}
      />

      {/* ── Diagonal Overlay 2 (White) ── */}
      <motion.div
        className="fixed inset-0 z-[9992] bg-white pointer-events-none"
        initial={{ skewY: 12, y: "0%" }}
        animate={{ y: "-160%", skewY: 12 }}
        exit={{ y: "0%", skewY: 12 }}
        transition={{ duration: T_DURATION, delay: 0.05, ease: EASE }}
      />

      {/* ── Massive Branded Text ── */}
      <div className="fixed inset-0 z-[9993] flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h1
          className="text-[18vw] font-heading font-black text-bg italic tracking-tighter"
          initial={{ x: "0%", skewX: -15, opacity: 1 }}
          animate={{ x: "160%", skewX: -15, opacity: 1 }}
          exit={{ x: "0%", skewX: -15, opacity: 1 }}
          transition={{ duration: T_DURATION + 0.2, ease: "power4.inOut" }}
        >
          {label}
        </motion.h1>
      </div>

      {/* ── Page Content ── */}
      <motion.div
        className="w-full min-h-[100dvh]"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
      >
        {children}
      </motion.div>
    </>
  );
}