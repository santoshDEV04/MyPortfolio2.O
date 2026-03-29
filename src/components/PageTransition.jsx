import { motion } from 'framer-motion';

// ─── Timing & Easing ───────────────────────────────────────────────────────
const T_DURATION = 0.4;
const EASE = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  return (
    <motion.div
      className="w-full min-h-[100dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: T_DURATION, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}