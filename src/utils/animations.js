import gsap from 'gsap';

export const fadeUp = (element, delay = 0, duration = 0.8) => {
  return gsap.fromTo(element, 
    { y: 60, opacity: 0 }, 
    { y: 0, opacity: 1, duration, delay, ease: "cinematic", willChange: "transform" }
  );
};

export const staggerReveal = (elements, delay = 0, staggerDuration = 0.1) => {
  return gsap.fromTo(elements, 
    { y: 60, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, stagger: staggerDuration, delay, ease: "cinematic", willChange: "transform" }
  );
};

export const lineReveal = (element, delay = 0) => {
  return gsap.fromTo(element, 
    { scaleX: 0 }, 
    { scaleX: 1, transformOrigin: 'left center', duration: 0.8, delay, ease: "cinematic", willChange: "transform" }
  );
};

export const countUp = (element, targetNumber, delay = 0) => {
  return gsap.to(element, {
    innerHTML: targetNumber,
    duration: 2,
    delay,
    snap: { innerHTML: 1 },
    ease: "power2.out"
  });
};
