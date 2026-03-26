import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';

export const useGSAP = (callback, dependencies = []) => {
  const isBrowser = typeof window !== 'undefined';
  const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    let ctx = gsap.context(() => {
      callback();
    });
    return () => ctx.revert();
  }, dependencies);
};
