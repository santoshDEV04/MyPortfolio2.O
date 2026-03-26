import PageTransition from '../components/PageTransition';
import SectionReveal from '../components/SectionReveal';
import MagneticButton from '../components/MagneticButton';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, School } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const circleRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero heading reveal
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 }
      );

      // Numbers count up
      gsap.utils.toArray('.stat-num').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.fromTo(stat,
          { innerHTML: 0 },
          {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            scrollTrigger: { trigger: stat, start: 'top 85%' }
          }
        );
      });

      // Rotating circle parallax via scroll scrub
      gsap.to(circleRef.current, {
        rotation: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Horizontal lines
      gsap.utils.toArray('.h-line').forEach(line => {
        gsap.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: line, start: 'top 85%' } }
        );
      });

      // Stats pop in
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-row', start: 'top 88%' }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <section className="about-container relative min-h-screen pt-24 pb-24 px-5 sm:px-8 md:px-16 overflow-hidden w-full">

        <div className="max-w-7xl mx-auto w-full">
          {/* ── Giant heading ── */}
          <h1
            ref={headingRef}
            className="font-heading font-extrabold tracking-tighter text-transparent leading-none mb-8 sm:mb-12 select-none"
            style={{
              WebkitTextStroke: '2px white',
              fontSize: 'clamp(3.5rem, 20vw, 200px)',
              opacity: 0,
            }}
          >
            ME!
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-6 lg:mt-16 w-full">

            {/* ── Left: Bio & Education ── */}
            <div className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
              <SectionReveal delay={0.2}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4 text-fg">Hey there! 👋</h2>
                <p className="text-base sm:text-lg md:text-xl text-muted leading-relaxed mb-4 font-medium">
                  I'm <span className="text-vl">Santosh Kumar Dash</span>, a passionate Full Stack Developer with expertise in React, Node.js, and cutting-edge web technologies.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <p className="text-sm sm:text-base md:text-lg text-muted/80 leading-relaxed">
                  I thrive on building clean, performant applications that transform complex ideas into seamless digital experiences. With a strong focus on efficiency, problem-solving, and user-centric design, I craft solutions that make an impact.
                </p>
              </SectionReveal>

              <div className="h-[1px] bg-border h-line origin-left w-full my-4 sm:my-6" />

              {/* Stats */}
              <div className="stats-row flex flex-row gap-6 sm:gap-10 py-2">
                {[
                  { target: 3, label: 'Years Exp.' },
                  { target: 20, label: 'Projects' },
                  { target: 5, label: 'Open Source' },
                ].map(({ target, label }) => (
                  <div key={label} className="stat-card">
                    <h3 className="text-3xl sm:text-4xl font-heading font-bold">
                      <span className="stat-num" data-target={target}>0</span>+
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mt-1 sm:mt-2">{label}</p>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-border/40 h-line origin-left w-full my-4 sm:my-6" />

              <SectionReveal delay={0.6}>
                <h3 className="text-sm sm:text-xl font-heading font-bold mb-5 sm:mb-8 flex items-center gap-3 text-vl uppercase tracking-widest">
                  <span className="w-6 sm:w-8 h-[1px] bg-vl/40" /> Educational Journey
                </h3>

                <div className="flex flex-col gap-6 sm:gap-10">
                  {[
                    {
                      school: 'Nalanda Institute of Technology',
                      degree: "Bachelor's Degree",
                      field: 'Computer Science & Engineering',
                      period: '2023 - Present',
                      icon: GraduationCap,
                      color: '#3b82f6',
                    },
                    {
                      school: 'Jawahar Navodaya Vidyalaya',
                      degree: 'Higher Secondary',
                      field: 'Science Stream',
                      period: '2015 - 2022',
                      icon: School,
                      color: '#f97316',
                    },
                  ].map((edu, idx) => (
                    <div key={idx} className="flex gap-4 sm:gap-6 group">
                      <div
                        className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${edu.color}20, ${edu.color}40)` }}
                      >
                        <edu.icon size={20} style={{ color: edu.color }} />
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: `radial-gradient(circle at center, ${edu.color}, transparent)` }} />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base md:text-xl font-bold tracking-tight text-fg group-hover:text-vl transition-colors">{edu.school}</h4>
                        <p className="text-vl text-xs sm:text-sm font-heading font-bold mt-1 uppercase tracking-wider">{edu.degree}</p>
                        <p className="text-muted text-xs sm:text-sm mt-1">{edu.field}</p>
                        <p className="text-dim text-xs mt-1 sm:mt-2 font-mono">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionReveal>

              <SectionReveal delay={0.8} className="mt-6 sm:mt-12">
                <MagneticButton href="/#/projects" style="outline">See My Work →</MagneticButton>
              </SectionReveal>
            </div>

            {/* ── Right: Rotating Circle ── */}
            <div className="flex justify-center items-center mt-4 lg:mt-0 relative order-1 lg:order-2">
              <div
                className="relative flex items-center justify-center"
                style={{ width: 'min(80vw, 420px)', height: 'min(80vw, 420px)' }}
              >
                {/* Spinning SVG text ring — using inline style fill to guarantee visibility */}
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    width: '100%',
                    height: '100%',
                    animation: 'aboutSpin 14s linear infinite',
                    filter: 'drop-shadow(0 0 18px rgba(168,85,247,0.45))',
                  }}
                >
                  <defs>
                    <style>{`
                      @keyframes aboutSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
                      @keyframes aboutSpinRev { from { transform:rotate(0deg); } to { transform:rotate(-360deg); } }
                    `}</style>
                  </defs>
                  <path
                    id="textPathAbout"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
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

                {/* Inner Core */}
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

                  {/* Inner text */}
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700,
                      fontSize: 'clamp(7px, 2vw, 11px)',
                      color: '#a855f7',
                      letterSpacing: '0.5em',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}>CREATIVE</div>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700,
                      fontSize: 'clamp(7px, 2vw, 11px)',
                      color: 'rgba(244,240,255,0.7)',
                      letterSpacing: '0.5em',
                      marginTop: '0.25rem',
                      animation: 'pulse 2s ease-in-out infinite 0.5s',
                    }}>CODER</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PageTransition>
  );
}
