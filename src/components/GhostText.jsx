/**
 * GhostText.jsx
 * A cinematic scrolling ghost-text banner.
 * Props:
 *   words   – string[]  Words to repeat across two rows
 *   row2    – string[]  Optional second row words (defaults to words reversed)
 *   speed1  – number    CSS animation duration row 1 (seconds, default 25)
 *   speed2  – number    CSS animation duration row 2 (default 35)
 */
export default function GhostText({ words = [], row2, speed1 = 25, speed2 = 35 }) {
  const row2Words = row2 || [...words].reverse();

  const repeated = (arr) => [...arr, ...arr, ...arr, ...arr]; // 4× to ensure seamless loop

  const trackStyle = (dur, dir = 'normal') => ({
    display: 'flex',
    gap: 0,
    whiteSpace: 'nowrap',
    animation: `ghostTrack ${dur}s linear infinite ${dir}`,
    willChange: 'transform',
  });

  const wordStyle = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(3.5rem, 10vw, 8rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'transparent',
    WebkitTextStroke: '1px rgba(147,51,234,0.10)',
    textTransform: 'uppercase',
    padding: '0 clamp(0.8rem, 2.5vw, 2rem)',
    userSelect: 'none',
    lineHeight: 1,
  };

  return (
    <>
      <style>{`
        @keyframes ghostTrack {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div style={trackStyle(speed1)}>
          {repeated(words).map((w, i) => (
            <span key={i} style={wordStyle}>{w}</span>
          ))}
        </div>
        <div style={trackStyle(speed2, 'reverse')}>
          {repeated(row2Words).map((w, i) => (
            <span key={i} style={{ ...wordStyle, WebkitTextStroke: '1px rgba(147,51,234,0.07)' }}>{w}</span>
          ))}
        </div>
      </div>
    </>
  );
}
