import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef({});

  // Initialize sounds
  useEffect(() => {
    const soundFiles = {
      click: '/sounds/click.mp3',
      hover: '/sounds/hover.mp3',
      hover2: '/sounds/hover2.mp3',
      loading: '/sounds/loadingsound.mp3',
      messageSent: '/sounds/messagesent.mp3',
      resumeDownload: '/sounds/resumedownload.mp3',
      whoosh: '/sounds/whoosh.mp3',
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      // Preload critical interaction sounds
      if (['click', 'hover', 'hover2'].includes(key)) {
        audio.preload = 'auto';
      }
      audioRefs.current[key] = audio;
    });

    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSound = (soundName, volume = 0.5) => {
    if (isMuted) return;
    const audio = audioRefs.current[soundName];
    if (audio) {
      // Clone the node to allow overlapping identical sounds (e.g. rapid hover)
      const clone = audio.cloneNode();
      clone.volume = volume;
      clone.play().catch(e => {
        // Auto-play might be blocked until user interacts
        // We gracefully ignore the error so it doesn't crash
        console.warn('Audio play blocked:', e);
      });
    }
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
