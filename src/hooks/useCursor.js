import { useState, useEffect } from 'react';

export const useCursor = () => {
  const [hoverType, setHoverType] = useState('default');

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setHoverType('pointer');
      } else if (target.closest('.project-card')) {
        setHoverType('project');
      } else {
        setHoverType('default');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return { hoverType };
};
