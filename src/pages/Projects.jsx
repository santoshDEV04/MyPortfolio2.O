import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';

gsap.registerPlugin(ScrollTrigger);

// ─── Real Project Data ────────────────────────────────────────────────────────
const allProjects = [
  {
    id: '01',
    title: 'StreamHub',
    desc: 'Production-grade backend for video streaming. Handles uploads, processing, JWT auth, and cloud storage at scale.',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Cloudinary', 'Multer'],
    category: 'Backend',
    image: '/images/backendPR.png',
    github: 'https://github.com/santoshDEV04',
    demo: '#',
  },
  {
    id: '02',
    title: 'Streamify',
    desc: 'Real-time video + chat application powered by WebSockets. Supports live rooms, instant messaging, and peer connections.',
    stack: ['React', 'Node.js', 'WebSockets', 'MongoDB'],
    category: 'Fullstack',
    image: '/images/streamify.png',
    github: 'https://github.com/santoshDEV04',
    demo: '#',
  },
  {
    id: '03',
    title: 'Portfolio Website',
    desc: 'My personal portfolio built with cinematic GSAP animations, Framer Motion transitions, and a brutalist void-luxury aesthetic.',
    stack: ['React', 'GSAP', 'Framer Motion', 'Tailwind'],
    category: 'Frontend',
    image: '/images/portfolio.png',
    github: 'https://github.com/santoshDEV04',
    demo: '#',
  },
];

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Fullstack'];

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(hover: none)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(cardRef.current, {
      rotateY: (x / rect.width) * 10,
      rotateX: -(y / rect.height) * 10,
      transformPerspective: 1200,
      ease: 'power2.out',
      duration: 0.4,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, ease: 'power3.out', duration: 0.6 });
  };

  return (
    <div
      ref={cardRef}
      className="project-card group relative flex flex-col overflow-hidden border border-fg/10 bg-fg/[0.02] will-change-transform cursor-none"
      style={{ borderRadius: 2, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Number badge */}
        <span
          className="absolute top-4 left-4 font-mono text-xs text-fg/40 font-bold tracking-widest"
        >
          {project.id}
        </span>

        {/* Category badge */}
        <span
          className="absolute top-4 right-4 font-mono text-[10px] px-3 py-1 border font-bold tracking-widest uppercase"
          style={{
            borderColor: 'rgba(168,85,247,0.5)',
            color: '#a855f7',
            background: 'rgba(168,85,247,0.08)',
            borderRadius: 2,
          }}
        >
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-7 gap-3">
        <h3 className="font-heading font-black tracking-tight text-fg text-xl sm:text-2xl leading-tight group-hover:text-vl transition-colors duration-300">
          {project.title}
        </h3>

        <p className="text-sm sm:text-base text-muted/80 leading-relaxed flex-1">
          {project.desc}
        </p>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-2 mt-1">
          {project.stack.map(tech => (
            <span
              key={tech}
              className="text-[10px] sm:text-xs font-mono px-2 sm:px-3 py-1 border border-fg/10 text-fg/50 rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-3 mt-auto border-t border-fg/10">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-mono uppercase tracking-widest text-fg hover:text-vl transition-colors group/link"
          >
            <span>Live Demo</span>
            <span className="text-base leading-none">↗</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-vl group-hover/link:w-full transition-all duration-300" />
          </a>

          <div className="w-px h-4 bg-fg/10" />

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-semibold font-mono uppercase tracking-widest text-muted hover:text-fg transition-colors group/link"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.907-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>View Code</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-fg group-hover/link:w-full transition-all duration-300" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState(allProjects);

  // Filter animation
  useEffect(() => {
    const cards = document.querySelectorAll('.project-card');
    gsap.to(cards, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      stagger: 0.05,
      onComplete: () => {
        const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter);
        setProjects(filtered);
        setTimeout(() => {
          gsap.fromTo('.project-card',
            { opacity: 0, y: 30, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' }
          );
        }, 40);
      },
    });
  }, [filter]);

  // Heading entry animation
  useEffect(() => {
    gsap.fromTo('.projects-heading',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.1 }
    );
    gsap.fromTo('.projects-eyebrow',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15 }
    );
  }, []);

  return (
    <PageTransition>
      <section className="min-h-screen pt-24 sm:pt-32 pb-24 px-5 sm:px-8 md:px-16 w-full max-w-7xl mx-auto">

        {/* ── Heading ── */}
        <span className="projects-eyebrow block font-mono text-[10px] tracking-[0.5em] text-vl uppercase mb-4 opacity-0">
          // SELECTED_WORK
        </span>
        <h1
          className="projects-heading font-heading font-extrabold tracking-tighter text-transparent leading-none mb-8 sm:mb-14 opacity-0"
          style={{ WebkitTextStroke: '2px var(--fg)', fontSize: 'clamp(3.5rem, 18vw, 200px)' }}
        >
          WORK
        </h1>

        {/* ── Filter Tabs ── */}
        <div className="flex flex-wrap gap-3 sm:gap-6 mb-10 sm:mb-14 border-b border-fg/10 pb-5">
          {CATEGORIES.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`relative text-sm sm:text-base font-mono font-medium pb-2 tracking-widest uppercase transition-colors cursor-none ${
                filter === tab ? 'text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              {tab}
              {filter === tab && (
                <span
                  className="absolute bottom-0 left-0 w-full h-px"
                  style={{ background: 'linear-gradient(90deg, #9333ea, rgba(147,51,234,0.2))' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Project Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <div className="mt-20 sm:mt-28 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-fg/10" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-muted uppercase">More on GitHub</span>
            <div className="h-px w-12 bg-fg/10" />
          </div>
          <a
            href="https://github.com/santoshDEV04"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-mono font-bold tracking-widest uppercase text-fg border border-white/10 px-8 py-4 hover:border-vl hover:text-vl transition-all duration-300 cursor-none"
            style={{ borderRadius: 2 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.907-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            View All Projects ↗
          </a>
        </div>

      </section>
    </PageTransition>
  );
}
