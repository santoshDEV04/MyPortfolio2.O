import { useEffect, useState } from 'react';
import gsap from 'gsap';
import PageTransition from '../components/PageTransition';
import MagneticButton from '../components/MagneticButton';
import TrueFocus from '../components/TrueFocus';
import { Mail } from 'lucide-react';

const Github = ({ size, className }) => (<svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>);
const Linkedin = ({ size, className }) => (<svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const Twitter = ({ size, className }) => (<svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>);

export default function Contact() {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.word-reveal', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power4.out', delay: 0.5 }
      );
      
      gsap.fromTo('.contact-elem',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out', delay: 1 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    
    setTimeout(() => {
      gsap.fromTo('.success-tick', 
        { strokeDasharray: 50, strokeDashoffset: 50 },
        { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }
      );
    }, 100);

    setTimeout(() => {
      setStatus('idle');
      e.target.reset();
    }, 3000);
  };

  const title = "LET'S BUILD SOMETHING.";
  const words = title.split(' ');

  const inputClasses = "w-full bg-transparent border-b border-white/20 pb-4 text-fg focus:outline-none focus:border-white transition-colors peer relative z-10 pt-4";
  const labelClasses = "absolute left-0 top-4 text-muted transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-fg peer-valid:-top-4 peer-valid:text-xs peer-valid:text-fg -z-10 peer-focus:z-10 peer-valid:z-10";

  return (
    <PageTransition>
      <section className="min-h-screen pt-24 sm:pt-32 pb-24 px-5 sm:px-8 md:px-16 max-w-7xl mx-auto w-full flex flex-col justify-center">
        <div className="mb-8 sm:mb-12 w-full flex justify-start word-reveal will-change-transform">
          <TrueFocus 
            sentence="LET'S BUILD SOMETHING."
            manualMode={false}
            blurAmount={4}
            borderColor="var(--accent)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.5}
            className="text-[10vw] sm:text-[12vw] md:text-[8vw] lg:text-[120px] font-heading font-extrabold tracking-tighter leading-[0.9]"
          />
        </div>
        
        <p className="contact-elem text-base sm:text-xl md:text-2xl text-muted font-body mb-12 sm:mb-24 opacity-0 max-w-2xl">
          Open to freelance, full-time, and collaboration
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 contact-elem opacity-0">
          <form className="lg:col-span-8 flex flex-col gap-12" onSubmit={handleSubmit}>
            <div className="relative">
              <input type="text" required className={inputClasses} id="name" />
              <label htmlFor="name" className={labelClasses}>Name</label>
            </div>
            
            <div className="relative">
              <input type="email" required className={inputClasses} id="email" />
              <label htmlFor="email" className={labelClasses}>Email</label>
            </div>
            
            <div className="relative">
              <textarea required className={`${inputClasses} resize-none h-32`} id="message" />
              <label htmlFor="message" className={labelClasses}>Message</label>
            </div>
            
            <div className="mt-8">
              <MagneticButton>
                {status === 'idle' ? 'Send Message' : (
                  <span className="flex items-center gap-2">
                    Sent
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path className="success-tick" d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                )}
              </MagneticButton>
            </div>
          </form>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Connect</h3>
            
            {[
              { name: 'GitHub', icon: Github, href: 'https://github.com/santoshDEV04' },
              { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/santosh-kumar-dash-417a30274/' },
              { name: 'LeetCode', icon: (props) => (
                <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ), href: 'https://leetcode.com/u/Santosh_ku04/' },
              { name: 'Email', icon: Mail, href: 'mailto:dashsantosh1333@gmail.com' }
            ].map(social => (
              <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-xl font-heading font-medium hover:text-white transition-colors w-max relative overflow-hidden pb-1 cursor-none">
                <social.icon size={20} className="text-muted group-hover:text-white transition-colors" />
                {social.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </a>
            ))}

            <div className="mt-auto pt-16">
                    <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">
        Local Time & Location
      </h3>
      <p className="text-lg">Bhubaneswar, Odisha, India 🇮🇳</p>
      <p className="text-muted">
        {new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
          timeZoneName: 'short',
        })}
      </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
