import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useTransition, PAGE_NAMES } from '../context/TransitionContext';

export default function MagneticButton({ children, href, onClick, className = "", style = "primary" }) {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { setPendingLabel } = useTransition();

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = btn.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.4);
      yTo(y * 0.4);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    
    // If it's a link, handle the transition logic
    if (href) {
      e.preventDefault();
      
      // Extract path from hash-routing format if present (e.g., /#/projects -> /projects)
      const cleanPath = href.replace('/#', '') || '/';
      
      // Set label for transition overlay
      setPendingLabel(PAGE_NAMES[cleanPath]);
      
      // Delay to let the transition trigger
      setTimeout(() => {
        navigate(cleanPath);
      }, 500); 
    }
  };

  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 font-heading text-sm font-semibold tracking-wide transition-colors duration-300 rounded-full cursor-none overflow-hidden group";
  
  const styles = {
    primary: "bg-fg text-bg hover:bg-gray-200 border border-transparent",
    outline: "border border-border text-fg hover:border-fg bg-transparent",
    ghost: "text-fg hover:text-gray-300"
  };

  const Component = 'button';

  return (
    <Component 
      ref={buttonRef} 
      onClick={handleClick} 
      className={`${baseStyles} ${styles[style] || styles.primary} ${className}`}
    >
      <span className="pointer-events-none relative z-10 block">{children}</span>
    </Component>
  );
}
