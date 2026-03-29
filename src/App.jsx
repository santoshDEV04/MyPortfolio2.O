import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import InteractiveGrid from './components/InteractiveGrid';
import ScrollProgress from './components/ScrollProgress';
import NoiseOverlay from './components/NoiseOverlay';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { TransitionProvider } from './context/TransitionContext';
import { SoundProvider } from './context/SoundContext';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Contact from './pages/Contact';

export default function App() {
  const location = useLocation();
  useSmoothScroll();

  return (
    <SoundProvider>
      <TransitionProvider>
        <Loader />
        <CustomCursor />
        <InteractiveGrid />
        <ScrollProgress />
        <NoiseOverlay />
        <Navbar />

        <main className="relative z-10 min-h-screen">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>
{/* 
        {location.pathname !== '/contact' && <Footer />} */}
      </TransitionProvider>
    </SoundProvider>
  );
}
