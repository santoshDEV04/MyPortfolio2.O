import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useTransition, PAGE_NAMES } from '../context/TransitionContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setPendingLabel } = useTransition();
  const menuRef = useRef(null);
  const tl = useRef(null);

  // Custom navigation handler to sync with GSAP
  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (path === location.pathname) {
      setMenuOpen(false);
      return;
    }
    
    // Set the target label globally for the transition overlay
    setPendingLabel(PAGE_NAMES[path]);
    
    setMenuOpen(false);
    
    // Wait for menu reverse animation to finish before navigating
    // Menu duration is 0.85s, we give it a slight buffer
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  useEffect(() => {
    // Start completely off-screen to the right
    gsap.set(menuRef.current, { xPercent: 100 });

    tl.current = gsap.timeline({ paused: true });

    // Panel slides in from right
    tl.current.to(menuRef.current, {
      xPercent: 0,
      duration: 0.85,
      ease: 'power4.inOut',
    });

    // Staggered nav links roll up from below
    tl.current.fromTo(
      '.menu-link-wrapper',
      { y: 80, opacity: 0, rotateX: -30 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
      },
      '-=0.45'
    );

    // Footer fades in
    tl.current.fromTo(
      '.menu-footer',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.5'
    );
  }, []);

  // Play / reverse timeline and lock scroll
  useEffect(() => {
    if (menuOpen) {
      tl.current.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current.reverse();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Handle outside items click or global close if needed
  // (Previously handled route change here, now handled by handleNavigation)

  // Hover highlight + dim siblings
  const handleLinkHover = (e, isEnter) => {
    if (isEnter) {
      gsap.to(e.currentTarget, {
        x: 24,
        color: 'var(--accent)',
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to('.menu-link:not(:hover)', { opacity: 0.18, duration: 0.35 });
    } else {
      gsap.to(e.currentTarget, {
        x: 0,
        color: 'inherit',
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to('.menu-link', { opacity: 1, duration: 0.35 });
    }
  };

  return (
    <>
      {/* ── HAMBURGER BUTTON ── */}
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-[130]">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="
            relative flex items-center justify-center
            w-12 h-12 sm:w-14 sm:h-14
            rounded-full
            bg-black/40 border border-white/10 backdrop-blur-md
            text-white
            hover:bg-white hover:text-black
            transition-colors duration-500
            overflow-hidden group
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
          "
        >
          {/* Accent ripple on hover */}
          <div className="
            absolute inset-0 rounded-full bg-accent/20
            scale-0 group-hover:scale-100
            transition-transform duration-500 will-change-transform
          " />
          <span className="relative z-10 transition-transform duration-300 group-hover:scale-90">
            {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </span>
        </button>
      </div>

      {/* ── FULLSCREEN OVERLAY ── */}
      <div
        ref={menuRef}
        className="
          fixed inset-0 z-[120]
          w-full h-[100dvh]
          bg-bg/96 backdrop-blur-2xl
          flex flex-col
          will-change-transform overflow-hidden
          font-heading text-fg
        "
      >
        {/* Atmospheric glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-2/3 h-2/3 bg-[radial-gradient(ellipse_at_top_right,var(--accent),transparent_65%)] opacity-[0.07]" />
          <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,var(--accent),transparent_70%)] opacity-[0.05]" />
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="
          relative z-10 flex flex-col
          flex-1 min-h-0
          justify-center
          px-6 sm:px-14 lg:px-28 xl:px-36
          pt-20 pb-4
          overflow-hidden
        ">
          {/* Eyebrow label */}
          <span className="
            block text-muted font-mono tracking-[0.4em] text-[10px] uppercase
            mb-6 sm:mb-8 lg:mb-10 ml-1
          ">
            Navigation
          </span>

          {/* Nav links */}
          <nav
            className="flex flex-col gap-0"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="overflow-hidden perspective-[1200px] menu-link-wrapper"
                style={{ paddingBlock: 'clamp(1px, 0.3vw, 6px)' }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `menu-link block w-fit font-heading font-black uppercase leading-[0.85] tracking-tighter select-none ${
                      isActive ? 'text-accent' : 'text-fg'
                    }`
                  }
                  style={{
                    fontSize: 'clamp(2rem, 7.5vw, 6.5rem)',
                  }}
                  onClick={(e) => handleNavigation(e, link.path)}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                >
                  {link.label}
                </NavLink>
              </div>
            ))}
          </nav>
        </div>

        {/* ── FOOTER ── */}
        <div className="
          menu-footer
          relative z-10
          flex flex-wrap items-center justify-between gap-4
          px-6 sm:px-14 lg:px-28 xl:px-36
          pb-6 sm:pb-8
          border-t border-white/5
          pt-4
        ">
          {/* Social links */}
          <div className="flex gap-5 sm:gap-7">
            {[
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/santosh-kumar-dash-417a30274/' },
              { label: 'Github', href: 'https://github.com/santoshDEV04' },
              { label: 'LeetCode', href: 'https://leetcode.com/u/Santosh_ku04/' }
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-mono text-[9px] sm:text-[10px] text-muted uppercase tracking-widest
                  hover:text-accent hover:-translate-y-0.5
                  transition-all duration-300
                "
              >
                {social.label}
              </a>
            ))}
          </div>

          {/* Current year / tagline */}
          <span className="font-mono text-[9px] sm:text-[10px] text-muted/40 uppercase tracking-widest">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </>
  );
}