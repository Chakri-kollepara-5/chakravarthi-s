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





function App() {
  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Ticker />
      <Skills />
      <Projects />
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
  );
}


export default App;
