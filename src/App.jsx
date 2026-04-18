import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import InteractiveGrid from './components/InteractiveGrid';

import Navbar from './components/Navbar';
import NoiseOverlay from './components/NoiseOverlay';
import ScrollProgress from './components/ScrollProgress';
import { SoundProvider } from './context/SoundContext';
import { TransitionProvider } from './context/TransitionContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import { lazy, Suspense } from 'react';
import { useIsMobile } from './hooks/useIsMobile';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Skills = lazy(() => import('./pages/Skills'));
const Contact = lazy(() => import('./pages/Contact'));

export default function App() {
  const location = useLocation();
  const isMobile = useIsMobile();
  useSmoothScroll();

  return (
    <SoundProvider>
      <TransitionProvider>

        {!isMobile && (
          <>
            <CustomCursor />
            <InteractiveGrid />
          </>
        )}
        <ScrollProgress />
        <NoiseOverlay />
        <Navbar />

        <main className="relative z-10 min-h-[100dvh]">
          <AnimatePresence mode="wait">
            <Suspense fallback={null}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
{/* 
        {location.pathname !== '/contact' && <Footer />} */}
      </TransitionProvider>
    </SoundProvider>
  );
}
