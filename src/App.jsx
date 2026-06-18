import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
// @ts-ignore: allow importing a .jsx module without a declaration file
import Skills from './components/Skills';

import Projects from './components/Projects';
import AuraProject from './components/AuraProject';
import CertificatesSection from './components/CertificatesSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ProjectDemoVideo from "./components/ProjectDemoVideo.jsx.jsx";
import ExploreDeeper from './components/ExploreDeeper';
import Splash from './components/Splash';
import { gsap } from 'gsap';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash) {
      const tl = gsap.timeline();
      
      // Reveal the main container
      tl.fromTo(
        ".reveal-container",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      
      // Staggered reveal of Hero section elements
      tl.fromTo(
        "#about-me h1",
        { opacity: 0, scale: 0.82, y: 60 },
        { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: "power4.out" },
        "-=0.9"
      );
      
      tl.fromTo(
        "#about-me p",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        "-=0.9"
      );

      tl.fromTo(
        "#about-me button, #about-me a",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
        "-=0.8"
      );

      tl.fromTo(
        "#about-me img",
        { opacity: 0, scale: 0.9, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out" },
        "-=0.8"
      );
    }
  }, [showSplash]);

  return (
    <>
      <Splash onComplete={() => setShowSplash(false)} />
      
      <div className={`reveal-container bg-transparent min-h-screen overflow-x-hidden ${
        showSplash ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'
      }`}>
        <Navbar />
        <Hero />
        <Ticker />
        <Skills />
        <Projects />
        <ExploreDeeper />
        <AuraProject />
        <CertificatesSection/>

        <ProjectDemoVideo
          title="SIH 2025 – ResQConnect: Disaster Management Solution"
          description="This is the official demo for our Smart India Hackathon problem statement focusing on Disaster Management. Our solution, ResQConnect, streamlines rescue operations, resource allocation, and real-time emergency response."
          video="/videos/resqconnect-demo.mp4"
        />

        <ContactForm />
        <Footer />
      </div>
    </>
  );
}

export default App;
