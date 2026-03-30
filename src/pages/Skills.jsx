import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import LogoLoop from '../components/LogoLoop';
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiGreensock, SiThreedotjs, SiRedux,
  SiNodedotjs, SiExpress, SiPostgresql, SiMongodb, SiRedis, SiGraphql,
  SiGit, SiDocker, SiFirebase, SiFigma, SiVercel, SiLinux, SiPostman,
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const row1 = [
  { node: <SiReact />,       title: 'React' },
  { node: <SiNextdotjs />,   title: 'Next.js' },
  { node: <SiTypescript />,  title: 'TypeScript' },
  { node: <SiTailwindcss />, title: 'Tailwind' },
  { node: <SiGreensock />,   title: 'GSAP' },
  { node: <SiThreedotjs />,  title: 'Three.js' },
  { node: <SiRedux />,       title: 'Redux' },
];

const row2 = [
  { node: <SiNodedotjs />,   title: 'Node.js' },
  { node: <SiExpress />,     title: 'Express' },
  { node: <SiPostgresql />,  title: 'PostgreSQL' },
  { node: <SiMongodb />,     title: 'MongoDB' },
  { node: <SiRedis />,       title: 'Redis' },
  { node: <SiGraphql />,     title: 'GraphQL' },
];

const row3 = [
  { node: <SiGit />,     title: 'Git' },
  { node: <SiDocker />,  title: 'Docker' },
  { node: <SiFirebase />,title: 'Firebase' },
  { node: <SiFigma />,   title: 'Figma' },
  { node: <SiVercel />,  title: 'Vercel' },
  { node: <SiLinux />,   title: 'Linux' },
  { node: <SiPostman />, title: 'Postman' },
];

const categories = [
  {
    label: 'Frontend',
    desc: 'Building fast, beautiful, accessible UIs with modern tooling.',
    skills: [
      { name: 'React / Next.js', val: 93 },
      { name: 'TypeScript',      val: 88 },
      { name: 'GSAP / Motion',   val: 85 },
      { name: 'Three.js / WebGL',val: 72 },
    ],
  },
  {
    label: 'Backend',
    desc: 'Designing scalable APIs and robust data pipelines.',
    skills: [
      { name: 'Node.js / Express', val: 90 },
      { name: 'PostgreSQL',        val: 82 },
      { name: 'MongoDB',           val: 80 },
      { name: 'GraphQL',           val: 75 },
    ],
  },
  {
    label: 'Tools & DevOps',
    desc: 'Shipping confidently with modern infra and developer tools.',
    skills: [
      { name: 'Git / GitHub',  val: 95 },
      { name: 'Docker',        val: 78 },
      { name: 'Firebase',      val: 80 },
      { name: 'Vercel / CI',   val: 88 },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero title chars ──
      gsap.fromTo('.skill-title-char',
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          stagger: 0.045,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.skills-heading', start: 'top 82%' },
        }
      );

      // ── Eyebrow ──
      gsap.fromTo('.skills-eyebrow',
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-heading', start: 'top 85%' },
        }
      );

      // ── Tagline ──
      gsap.fromTo('.skills-tagline',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-tagline', start: 'top 88%' },
        }
      );

      // ── Logo strip reveal ──
      gsap.fromTo('.logo-strip',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.logo-strip', start: 'top 85%' },
        }
      );

      // ── Category cards stagger in ──
      gsap.fromTo('.cat-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' },
        }
      );

      // ── Progress bars (per bar, on scroll) ──
      gsap.utils.toArray('.progress-bar').forEach((bar) => {
        gsap.fromTo(bar,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 92%' },
          }
        );
      });

      // ── Stat numbers count up ──
      gsap.utils.toArray('.stat-num').forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 1.8,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div ref={sectionRef} className="relative w-full overflow-x-hidden">

        {/* ═══════════ HERO HEADING ═══════════ */}
        <section className="relative pt-28 sm:pt-36 pb-8 sm:pb-12 px-6 sm:px-12 md:px-20 max-w-[1400px] mx-auto">

          <span className="skills-eyebrow opacity-0 font-mono text-[9px] sm:text-[10px] tracking-[0.45em] text-muted uppercase block mb-5">
            Expertise
          </span>

          {/* Giant outlined title — nowrap, clamp to one line */}
          <h1
            className="skills-heading font-heading font-black tracking-tighter leading-[0.82] overflow-hidden whitespace-nowrap"
            style={{
              fontSize: 'clamp(3.5rem, 13vw, 11rem)',
              WebkitTextStroke: '2px var(--fg)',
              color: 'transparent',
            }}
          >
            {'SKILLS'.split('').map((char, i) => (
              <span
                key={i}
                className="skill-title-char inline-block will-change-transform"
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <p className="skills-tagline opacity-0 mt-6 sm:mt-8 text-muted text-sm sm:text-base max-w-md leading-relaxed">
            A growing toolkit spanning UI craft, server-side engineering, and modern DevOps workflows.
          </p>

          {/* Stats row */}
          <div className="mt-10 sm:mt-14 flex flex-wrap gap-8 sm:gap-14">
            {[
              { label: 'Technologies', target: 20 },
              { label: 'Projects Shipped', target: 30 },
              { label: 'Years Learning', target: 4 },
            ].map(({ label, target }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="stat-num font-heading font-black text-fg leading-none tabular-nums"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                  data-target={target}
                >
                  0
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-muted uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ SCROLLING LOGO STRIP ═══════════ */}
        <section className="logo-strip opacity-0 relative w-screen left-1/2 -translate-x-1/2 bg-fg/[0.025] border-y border-fg/[0.07] py-14 sm:py-20 mt-12 sm:mt-16 flex flex-col gap-10 sm:gap-14 overflow-hidden">

          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-40 pointer-events-none z-10"
            style={{ background: 'linear-gradient(90deg, var(--bg) 0%, transparent 100%)' }} />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-40 pointer-events-none z-10"
            style={{ background: 'linear-gradient(270deg, var(--bg) 0%, transparent 100%)' }} />

          <LogoLoop
            logos={row1}
            speed={35}
            direction="left"
            logoHeight={96}
            gap={64}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--bg)"
          />
          <LogoLoop
            logos={row2}
            speed={45}
            direction="right"
            logoHeight={96}
            gap={64}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--bg)"
          />
          <LogoLoop
            logos={row3}
            speed={55}
            direction="left"
            logoHeight={96}
            gap={64}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="var(--bg)"
          />
        </section>

        {/* ═══════════ SKILL CATEGORY CARDS ═══════════ */}
        <section className="skills-grid py-20 sm:py-28 px-6 sm:px-12 md:px-20 max-w-[1400px] mx-auto">

          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.45em] text-muted uppercase block mb-10 sm:mb-14">
            Breakdown
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {categories.map(({ label, desc, skills }) => (
              <div
                key={label}
                className="cat-card opacity-0 group relative overflow-hidden border border-fg/10 p-7 sm:p-9 bg-fg/[0.02] hover:bg-fg hover:text-bg transition-all duration-500"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-black/20 transition-colors duration-500" />

                <h3
                  className="font-heading font-black tracking-tighter mb-2 leading-none"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
                >
                  {label}
                </h3>
                <p className="text-muted group-hover:text-black/60 text-xs sm:text-sm leading-relaxed mb-8 transition-colors duration-300">
                  {desc}
                </p>

                <div className="flex flex-col gap-5">
                  {skills.map(({ name, val }) => (
                    <div key={name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-mono text-[10px] sm:text-[11px] tracking-wide text-fg/70 group-hover:text-black/60 transition-colors duration-300">
                          {name}
                        </span>
                        <span className="font-mono text-[10px] sm:text-[11px] text-muted group-hover:text-black/40 transition-colors duration-300">
                          {val}%
                        </span>
                      </div>
                      {/* Track */}
                      <div className="w-full h-px bg-fg/10 group-hover:bg-bg/10 overflow-visible relative transition-colors duration-300">
                        {/* Fill */}
                        <div
                          className="progress-bar absolute top-0 left-0 h-full origin-left"
                          style={{
                            width: `${val}%`,
                            background: 'linear-gradient(90deg, var(--accent), rgba(255,255,255,0.8))',
                            boxShadow: '0 0 6px var(--accent)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category number ghost */}
                <span
                  className="absolute bottom-4 right-6 font-heading font-black opacity-[0.04] group-hover:opacity-[0.07] transition-opacity leading-none pointer-events-none"
                  style={{ fontSize: '6rem' }}
                >
                  {String(categories.findIndex(c => c.label === label) + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}