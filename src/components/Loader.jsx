import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useLoader } from '../context/LoaderContext';

const TEXTS = [
  'INITIALIZING SYSTEM',
  'LOADING ASSETS',
  'ESTABLISHING CONNECTION',
  'DECRYPTING INTERFACE',
  'READY',
];

// ── Wipe constants ──────────────────────────────────────────────
const SKEW   = 300;   // horizontal shear (controls diagonal angle)
const BAND_W = 280;   // screen-x width of the feathered wipe band
const FEATHER = 120;  // soft-edge zone on each side of the band
const SLICES  = 80;   // rasterisation slices (higher = smoother)
const MAX_ALPHA = 0.88;

function drawWipe(ctx, W, H, progress) {
  ctx.clearRect(0, 0, W, H);

  // Ease: easeInOutQuad on the progress
  const p = progress;
  const eased = p < 0.5
    ? 2 * p * p
    : 1 - Math.pow(-2 * p + 2, 2) / 2;

  // Center of the wipe band in screen-x
  const cx = -BAND_W / 2 - SKEW + eased * (W + BAND_W + SKEW * 2 + SKEW);

  const sliceW = BAND_W / SLICES + 1;
  const featherT = FEATHER / BAND_W;

  for (let s = 0; s < SLICES; s++) {
    const t       = s / SLICES;
    const screenX = cx - BAND_W / 2 + t * BAND_W;

    // Raised-cosine alpha envelope
    let alpha;
    if (t < featherT) {
      alpha = t / featherT;
    } else if (t > 1 - featherT) {
      alpha = (1 - t) / featherT;
    } else {
      alpha = 1;
    }
    // smoothstep + clamp
    alpha = alpha * alpha * (3 - 2 * alpha) * MAX_ALPHA;

    ctx.beginPath();
    ctx.moveTo(screenX,              0);
    ctx.lineTo(screenX + sliceW,     0);
    ctx.lineTo(screenX + sliceW + SKEW, H);
    ctx.lineTo(screenX + SKEW,       H);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fill();
  }
}

export default function Loader() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const barFillRef   = useRef(null);

  const { loaderDone, setLoaderDone } = useLoader();
  const [mounted, setMounted]         = useState(true);
  const [textIdx, setTextIdx]         = useState(0);
  const [count, setCount]             = useState(0);

  // Keep canvas sized to viewport
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    if (loaderDone) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const canvas   = canvasRef.current;
    const ctx      = canvas.getContext('2d');
    const TOTAL_MS = 3200;
    const start    = performance.now();
    let raf;
    let lastIdx    = -1;

    const frame = (now) => {
      const p  = Math.min((now - start) / TOTAL_MS, 1);
      const v  = Math.round(p * 100);

      // Draw wipe
      drawWipe(ctx, canvas.width, canvas.height, p);

      // Counter + bar
      setCount(v);
      const idx = p < 0.20 ? 0 : p < 0.45 ? 1 : p < 0.65 ? 2 : p < 0.85 ? 3 : 4;
      if (idx !== lastIdx) { setTextIdx(idx); lastIdx = idx; }

      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCount(100);
        setTextIdx(4);

        // Exit: slide loader up
        gsap.to(containerRef.current, {
          yPercent  : -100,
          duration  : 0.9,
          ease      : 'power4.inOut',
          delay     : 0.5,
          onComplete: () => { setLoaderDone(true); setMounted(false); },
        });
      }
    };

    raf = requestAnimationFrame(frame);

    // Progress bar via gsap (independent, stays accurate)
    const barCtx = gsap.context(() => {
      gsap.fromTo(
        barFillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: TOTAL_MS / 1000, ease: 'power1.inOut', transformOrigin: 'left' },
      );
    }, containerRef);

    return () => {
      cancelAnimationFrame(raf);
      barCtx.revert();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [loaderDone, setLoaderDone, resizeCanvas]);

  if (!mounted && loaderDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#000', color: '#fff' }}
      aria-label="Loading"
      role="status"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />

      {/* Canvas — diagonal wipe lives here */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation : 'scanDown 2.4s linear infinite',
        }}
      />

      {/* Corner marks */}
      {[
        'top-[16px] left-[16px] border-t border-l',
        'top-[16px] right-[16px] border-t border-r',
        'bottom-[16px] left-[16px] border-b border-l',
        'bottom-[16px] right-[16px] border-b border-r',
      ].map((cls, i) => (
        <div key={i} className={`absolute w-6 h-6 z-10 border-white/25 ${cls}`} style={{ borderWidth: 1.5 }} />
      ))}

      {/* Giant counter — mix-blend-mode:difference so wipe punches through it */}
      <div
        className="relative z-[5] select-none text-center"
        style={{
          fontFamily   : "'Space Grotesk', sans-serif",
          fontSize     : 'clamp(7rem, 22vw, 12rem)',
          fontWeight   : 900,
          letterSpacing: '-0.06em',
          lineHeight   : 0.9,
          mixBlendMode : 'difference',
        }}
      >
        {String(count).padStart(2, '0')}
        <span style={{ fontSize: '0.28em', verticalAlign: 'super', letterSpacing: 0, opacity: 0.5 }}>%</span>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-[5] mt-9 overflow-hidden"
        style={{ width: 'min(480px, 80vw)', height: 2, background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          ref={barFillRef}
          className="absolute inset-0 origin-left"
          style={{
            background: '#fff',
            boxShadow : '0 0 14px #fff, 0 0 36px rgba(255,255,255,0.45)',
          }}
        />
      </div>

      {/* Status text */}
      <div
        key={textIdx}
        className="relative z-[5] uppercase mt-7"
        style={{
          fontFamily   : "'Space Mono', monospace",
          fontSize     : 'clamp(8px, 2vw, 10px)',
          letterSpacing: '0.45em',
          color        : 'rgba(255,255,255,0.28)',
          animation    : 'fadeSlideUp 0.25s ease forwards',
        }}
      >
        {TEXTS[textIdx]}
      </div>

      {/* Version */}
      <div
        className="absolute bottom-4 z-10 uppercase"
        style={{
          fontFamily   : "'Space Mono', monospace",
          fontSize     : 8,
          letterSpacing: '0.3em',
          color        : 'rgba(255,255,255,0.1)',
        }}
      >
        v1.0.0 &nbsp;·&nbsp; Portfolio
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanDown {
          0%   { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}