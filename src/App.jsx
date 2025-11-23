import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
// @ts-ignore: allow importing a .jsx module without a declaration file
import Skills from './components/Skills';
// @ts-ignore: allow importing a .jsx module without a declaration file
import Projects from './components/Projects';
import CertificatesSection from './components/CertificatesSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Ticker />
      <Skills />
      <Projects />
      <CertificatesSection/>
      <ContactForm />
      <Footer />
    </div>
  );
}


export default App;
