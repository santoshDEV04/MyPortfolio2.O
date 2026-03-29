import PageTransition from '../components/PageTransition';
import SectionReveal from '../components/SectionReveal';
import MagneticButton from '../components/MagneticButton';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, School } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const circleRef  = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 }
      );

      gsap.utils.toArray('.stat-num').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.fromTo(stat,
          { innerHTML: 0 },
          {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            scrollTrigger: { trigger: stat, start: 'top 85%' },
          }
        );
      });

      gsap.to(circleRef.current, {
        rotation: 720,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.utils.toArray('.h-line').forEach(line => {
        gsap.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: line, start: 'top 85%' } }
        );
      });

      gsap.fromTo('.stat-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-row', start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <section
        className="about-container relative min-h-screen pt-24 pb-24 px-5 sm:px-8 md:px-16 overflow-hidden w-full"
      >
        <div className="max-w-7xl mx-auto w-full">

          {/* ── Giant outline heading ── */}
          <h1
            ref={headingRef}
            className="font-heading font-extrabold tracking-tighter text-transparent leading-none mb-12 select-none w-fit"
            style={{
              WebkitTextStroke: '2px var(--fg)',
              fontSize: 'clamp(3.5rem, 20vw, 200px)',
              opacity: 0,
            }}
          >
            ME!
          </h1>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start w-full">

            {/* ── LEFT: Bio, stats, education ── */}
            <div className="flex flex-col gap-6 sm:gap-8">

              <SectionReveal delay={0.2}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 text-fg">
                  Hey there! 👋
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed mb-4 font-medium">
                  I'm <span className="text-vl">Santosh Kumar Dash</span>, a passionate Full Stack Developer
                  with expertise in React, Node.js, and cutting-edge web technologies.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <p className="text-sm sm:text-base md:text-lg text-muted/80 leading-relaxed">
                  I thrive on building clean, performant applications that transform complex ideas into
                  seamless digital experiences. With a strong focus on efficiency, problem-solving, and
                  user-centric design, I craft solutions that make an impact.
                </p>
              </SectionReveal>

              <div className="h-[1px] bg-border h-line origin-left w-full my-2" />

              {/* Stats */}
              <div className="stats-row flex flex-row gap-8 sm:gap-12 py-2">
                {[
                  { target: 3,  label: 'Years Exp.' },
                  { target: 20, label: 'Projects'   },
                  { target: 5,  label: 'Open Source' },
                ].map(({ target, label }) => (
                  <div key={label} className="stat-card">
                    <h3 className="text-3xl sm:text-4xl font-heading font-bold">
                      <span className="stat-num" data-target={target}>0</span>+
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-border/40 h-line origin-left w-full my-2" />

              {/* Education */}
              <SectionReveal delay={0.6}>
                <h3 className="text-sm sm:text-base font-heading font-bold mb-6 flex items-center gap-3 text-vl uppercase tracking-widest">
                  <span className="w-6 sm:w-8 h-[1px] bg-vl/40" /> Educational Journey
                </h3>

                <div className="flex flex-col gap-7">
                  {[
                    {
                      school: 'Nalanda Institute of Technology',
                      degree: "Bachelor's Degree",
                      field:  'Computer Science & Engineering',
                      period: '2023 - Present',
                      icon:   GraduationCap,
                      color:  '#ffffffff',
                    },
                    {
                      school: 'Jawahar Navodaya Vidyalaya',
                      degree: 'Higher Secondary',
                      field:  'Science Stream',
                      period: '2015 - 2022',
                      icon:   School,
                      color:  'rgba(255, 255, 255, 1)',
                    },
                  ].map((edu, idx) => (
                    <div key={idx} className="flex gap-4 sm:gap-6 group">
                      <div
                        className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${edu.color}20, ${edu.color}40)` }}
                      >
                        <edu.icon size={20} style={{ color: edu.color }} />
                        <div
                          className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                          style={{ background: `radial-gradient(circle at center, ${edu.color}, transparent)` }}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-fg group-hover:text-vl transition-colors">
                          {edu.school}
                        </h4>
                        <p className="text-vl text-xs sm:text-sm font-heading font-bold mt-1 uppercase tracking-wider">
                          {edu.degree}
                        </p>
                        <p className="text-muted text-xs sm:text-sm mt-1">{edu.field}</p>
                        <p className="text-dim text-xs mt-1 sm:mt-2 font-mono">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal delay={0.8} className="mt-4 sm:mt-8">
                <MagneticButton href="/#/projects" style="outline">See My Work →</MagneticButton>
              </SectionReveal>
            </div>

            {/* ── RIGHT: Photo + spinning ring ── */}
            <div className="flex flex-col items-center gap-10 lg:gap-14 mt-2 lg:mt-[-230px]">

              {/* ─ Grained, faded photo ─ */}
              <SectionReveal delay={0.3} className="w-full">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ borderRadius: '20px', aspectRatio: '4/5', maxHeight: 520 }}
                >
                  {/* The photo */}
                  <img
                    src="picofme.png"
                    alt="Santosh Kumar Dash"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                      filter: 'grayscale(18%) contrast(1.04)',
                      opacity: 0.2
                    }}
                  />

                  {/* Radial fade — darkens all edges, heavier at bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      background: `
                        radial-gradient(ellipse 100% 90% at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 100%),
                        linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.72) 100%)
                      `,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* SVG grain overlay */}
                  <svg
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '20px',
                      opacity: 0.38,
                      mixBlendMode: 'overlay',
                      pointerEvents: 'none',
                    }}
                  >
                    <filter id="grain-filter">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.72"
                        numOctaves="4"
                        stitchTiles="stitch"
                      />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grain-filter)" />
                  </svg>

                  {/* Subtle border */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </SectionReveal>

              {/* ─ Spinning ring ─ */}
              <div
                className="relative flex items-center justify-center flex-shrink-0"
                style={{ width: 'min(72vw, 340px)', height: 'min(72vw, 340px)' }}
              >
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    width: '100%',
                    height: '100%',
                    animation: 'aboutSpin 14s linear infinite',
                    filter: 'drop-shadow(0 0 14px rgba(168,85,247,0.4))',
                  }}
                >
                  <defs>
                    <style>{`
                      @keyframes aboutSpin    { from { transform:rotate(0deg);   } to { transform:rotate(360deg);  } }
                      @keyframes aboutSpinRev { from { transform:rotate(0deg);   } to { transform:rotate(-360deg); } }
                    `}</style>
                  </defs>
                  <path
                    id="textPathAbout"
                    d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    fill="transparent"
                  />
                  <text
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      fill: '#a855f7',
                    }}
                  >
                    <textPath href="#textPathAbout" startOffset="0%">
                      • CREATIVE DEVELOPER • CODE ARTIST • UI ENGINEER • CREATIVE DEVELOPER • CODE ARTIST • UI ENGINEER •
                    </textPath>
                  </text>
                </svg>

                <div
                  ref={circleRef}
                  style={{
                    position: 'absolute',
                    width: '54%',
                    height: '54%',
                    borderRadius: '50%',
                    border: '1px solid rgba(168,85,247,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, rgba(168,85,247,0.12) 0%, transparent 70%)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 4,
                    borderRadius: '50%',
                    border: '1px dashed rgba(168,85,247,0.2)',
                    animation: 'aboutSpinRev 20s linear infinite',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700,
                      fontSize: 'clamp(13px, 3.5vw, 20px)',
                      color: '#a855f7',
                      letterSpacing: '0.45em',
                    }}>CREATIVE</div>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700,
                      fontSize: 'clamp(7px, 1.8vw, 11px)',
                      color: 'rgba(244,240,255,0.65)',
                      letterSpacing: '0.45em',
                      marginTop: '0.3rem',
                    }}>CODER</div>
                  </div>
                </div>
              </div>

            </div>
            {/* end RIGHT */}

          </div>
        </div>
      </section>
    </PageTransition>
  );
}