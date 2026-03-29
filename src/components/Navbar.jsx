import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useTransition, PAGE_NAMES } from '../context/TransitionContext';
import { useTheme } from '../hooks/useTheme';
import { useSound } from '../context/SoundContext';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Work' },
  { path: '/skills', label: 'Skills' },
  { path: '/contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/santosh-kumar-dash-417a30274/',
  },
  { label: 'Github', href: 'https://github.com/santoshDEV04' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/Santosh_ku04/' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setPendingLabel } = useTransition();
  const { theme, toggleTheme } = useTheme();
  const { playSound } = useSound();

  const menuRef = useRef(null);
  const tl = useRef(null);

  const handleNavigation = (e, path) => {
    e.preventDefault();
    playSound('click', 1.0);
    if (path === location.pathname) {
      setMenuOpen(false);
      return;
    }

    setPendingLabel(PAGE_NAMES[path]);
    setMenuOpen(false);

    // Wait for the reverse animation (duration is ~0.85s)
    setTimeout(() => {
      navigate(path);
    }, 850);
  };

  useEffect(() => {
    // gsap.context ensures clean up and prevents React strict-mode bugs
    let ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });

      // 1. Sleek clip-path curtain reveal for the background
      tl.current.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.85,
        ease: 'power4.inOut',
      });

      // 2. High-end masked text reveal with slight skew
      tl.current.fromTo(
        '.menu-link-inner',
        { y: '110%', skewY: 5 },
        {
          y: '0%',
          skewY: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power4.out',
        },
        '-=0.4' // Overlap with the background reveal
      );

      // 3. Fade in footer and eyebrow text
      tl.current.fromTo(
        ['.menu-eyebrow', '.menu-footer'],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.5'
      );
    });

    return () => ctx.revert();
  }, []);

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

  // Premium hover effect: Shift right, change color, dim siblings
  const handleLinkHover = (e, isEnter) => {
    if (isEnter) {
      playSound('hover', 0.8);
      gsap.to(e.currentTarget, {
        x: 30,
        color: 'var(--accent)',
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.to('.menu-link:not(:hover)', {
        opacity: 0.15,
        scale: 0.98,
        duration: 0.4,
      });
    } else {
      gsap.to(e.currentTarget, {
        x: 0,
        color: 'inherit',
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.to('.menu-link', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
      });
    }
  };

  return (
    <>
      {/* ── HAMBURGER BUTTON & THEME TOGGLE ── */}
      <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-[130] flex items-center gap-3">
        <button
          onClick={() => { playSound('click', 1.0); toggleTheme(); }}
          aria-label="Toggle theme"
          className="
            relative flex items-center justify-center
            w-11 h-11 sm:w-12 sm:h-12
            rounded-full
            bg-fg/10 border border-fg/20 backdrop-blur-md
            text-fg hover:bg-fg hover:text-bg
            transition-colors duration-500
            overflow-hidden group
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
          "
        >
          <div className="absolute inset-0 rounded-full bg-accent/20 scale-0 group-hover:scale-100 transition-transform duration-500 will-change-transform" />
          <span className="relative z-10 transition-transform duration-300 group-hover:scale-90">
            {theme === 'dark' ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </span>
        </button>
        
        <button
          onClick={() => { playSound('click', 1.0); setMenuOpen(prev => !prev); }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="
            relative flex items-center justify-center
            w-12 h-12 sm:w-14 sm:h-14
            rounded-full
            bg-fg/10 border border-fg/20 backdrop-blur-md
            text-fg hover:bg-fg hover:text-bg
            transition-colors duration-500
            overflow-hidden group
            focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
          "
        >
          <div className="absolute inset-0 rounded-full bg-accent/20 scale-0 group-hover:scale-100 transition-transform duration-500 will-change-transform" />
          <span className="relative z-10 transition-transform duration-300 group-hover:scale-90">
            {menuOpen ? (
              <X size={22} strokeWidth={2.5} />
            ) : (
              <Menu size={22} strokeWidth={2.5} />
            )}
          </span>
        </button>
      </div>

      {/* ── FULLSCREEN OVERLAY ── */}
      <div
        ref={menuRef}
        // Initial state hides the menu using clip-path instead of off-screen translation
        className="
          fixed inset-0 z-[120]
          w-full h-[100dvh]
          bg-bg/96 backdrop-blur-2xl
          flex flex-col
          will-change-transform overflow-hidden
          font-heading text-fg
        "
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }}
      >
        {/* Atmospheric glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-2/3 h-2/3 bg-[radial-gradient(ellipse_at_top_right,var(--accent),transparent_65%)] opacity-[0.07]" />
          <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,var(--accent),transparent_70%)] opacity-[0.05]" />
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="relative z-10 flex flex-col flex-1 min-h-0 justify-center px-6 sm:px-14 lg:px-28 xl:px-36 pt-20 pb-4 overflow-hidden">
          <span className="menu-eyebrow block text-muted font-mono tracking-[0.4em] text-[10px] uppercase mb-6 sm:mb-8 lg:mb-10 ml-1">
            Navigation
          </span>

          <nav
            className="flex flex-col gap-1 sm:gap-2"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(link => (
              <div
                key={link.path}
                // overflow-hidden is crucial here to mask the text as it slides up
                className="overflow-hidden"
              >
                <NavLink
                  to={link.path}
                  onClick={e => handleNavigation(e, link.path)}
                  onMouseEnter={e => handleLinkHover(e, true)}
                  onMouseLeave={e => handleLinkHover(e, false)}
                  className={({ isActive }) =>
                    `menu-link block w-fit cursor-pointer ${isActive ? 'text-accent' : 'text-fg'}`
                  }
                >
                  <div
                    className="menu-link-inner font-heading font-black uppercase leading-[0.85] tracking-tighter select-none origin-left"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
                  >
                    {link.label}
                  </div>
                </NavLink>
              </div>
            ))}
          </nav>
        </div>

        {/* ── FOOTER ── */}
        <div className="menu-footer relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-14 lg:px-28 xl:px-36 pb-6 sm:pb-8 border-t border-fg/10 pt-4">
          <div className="flex gap-5 sm:gap-7">
            {SOCIAL_LINKS.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] sm:text-[10px] text-muted uppercase tracking-widest hover:text-accent hover:-translate-y-0.5 transition-all duration-300"
              >
                {social.label}
              </a>
            ))}
          </div>

          <span className="font-mono text-[9px] sm:text-[10px] text-muted/40 uppercase tracking-widest">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </>
  );
}
