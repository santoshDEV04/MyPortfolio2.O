export default function InteractiveGrid() {
  return (
    <div 
      className="fixed inset-0 z-[0] pointer-events-none hidden md:block" 
      style={{ 
        backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        WebkitMaskImage: `
          radial-gradient(circle 150px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 0%, transparent 100%),
          radial-gradient(circle 600px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(0,0,0,0.4) 0%, transparent 100%)
        `,
        maskImage: `
          radial-gradient(circle 150px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 0%, transparent 100%),
          radial-gradient(circle 600px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(0,0,0,0.4) 0%, transparent 100%)
        `,
        opacity: 1
      }} 
    />
  );
}
