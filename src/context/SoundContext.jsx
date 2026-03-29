import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef(null);
  const buffersRef = useRef({});

  useEffect(() => {
    // Initialize Web Audio API AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    audioContextRef.current = new AudioContext();

    const soundFiles = {
      click: '/sounds/click.mp3',
      hover: '/sounds/hover.mp3',
      hover2: '/sounds/hover2.mp3',
      loading: '/sounds/loadingsound.mp3',
      messageSent: '/sounds/messagesent.mp3',
      resumeDownload: '/sounds/resumedownload.mp3',
      whoosh: '/sounds/whoosh.mp3',
    };

    // Load and decode all sounds
    Object.entries(soundFiles).forEach(async ([key, src]) => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode audio data using the context
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        buffersRef.current[key] = audioBuffer;
      } catch (err) {
        console.warn(`Failed to preload or decode sound '${key}':`, err);
      }
    });

    // Cleanup
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (soundName, volume = 1.0) => {
    if (isMuted) return;
    
    const ctx = audioContextRef.current;
    const buffer = buffersRef.current[soundName];
    
    if (ctx && buffer) {
      try {
        // Resume AudioContext if suspended (often happens before first user interaction)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = ctx.createGain();
        // Master volume multiplier base to significantly increase website sound
        const masterVolumeBump = 3.0;
        gainNode.gain.value = volume * masterVolumeBump; 
        
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } catch (e) {
        console.warn('Audio play blocked or failed:', e);
      }
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
