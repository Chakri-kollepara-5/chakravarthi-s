import { motion } from "framer-motion";
import { Download, Github, Linkedin } from "lucide-react";
import { socialLinks, resumeUrl } from "../data/links";
import LeetCodeIcon from "../icons/LeetCodeIcon";
import Lottie from "lottie-react";
import handAnim from "../animations/hand-place.json";

import "./lines.css";
import "./imageGlow.css";

const Hero = () => {
  const handleResumeDownload = () => {
    const a = document.createElement("a");
    a.href = resumeUrl;
    a.target = "_blank";
    a.download = "Kollepara_K_V_Sri_Chakravarthi_Resume.pdf";
    a.click();
  };

  const getSocialIcon = (name) => {
    switch (name) {
      case "GitHub":
        return <Github size={24} />;
      case "LinkedIn":
        return <Linkedin size={24} />;
      case "LeetCode":
        return <LeetCodeIcon size={24} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="about-me"
      className="min-h-screen flex flex-col items-center justify-center relative pt-20 pb-10 text-dandy-950 overflow-hidden"
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-300/15 rounded-full blur-[120px] -z-10 animate-pulse-glow"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-dandy-300/25 rounded-full blur-[100px] -z-10 animate-float"></div>

      {/* 3D FLOATING DECORATIVE ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large orbiting ring */}
        <motion.div
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] right-[5%] w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full border-[1.5px] border-dandy-400/15 opacity-40"
          style={{ transformStyle: "preserve-3d", transform: "rotateX(65deg)" }}
        />

        {/* Small floating glass sphere */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[8%] w-8 h-8 md:w-12 md:h-12 rounded-full hidden md:block"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(253,220,168,0.5), rgba(192,139,62,0.1))",
            boxShadow: "0 8px 32px rgba(192,139,62,0.1), inset 0 -4px 12px rgba(192,139,62,0.08)",
          }}
        />

        {/* Floating diamond */}
        <motion.div
          animate={{ rotate: [45, 405], y: [-10, 10, -10] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[25%] right-[12%] w-6 h-6 opacity-20 hidden md:block"
          style={{
            background: "linear-gradient(135deg, #D4A76A, #F7C97E)",
            borderRadius: "3px",
          }}
        />

        {/* Dotted orbit path */}
        <motion.div
          animate={{ rotateZ: [0, -360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[35%] left-[3%] w-[120px] h-[120px] rounded-full border border-dashed border-dandy-400/10 opacity-30 hidden lg:block"
          style={{ transform: "rotateX(70deg) rotateY(20deg)" }}
        />
      </div>

      <div className="w-full max-w-[95%] mx-auto flex flex-col items-center justify-center relative z-20 text-center mt-10">
        
        {/* MASSIVE TYPOGRAPHY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full flex justify-center"
        >
          <h1 className="text-[10vw] md:text-[12vw] ape-heading text-glow whitespace-nowrap z-10 relative">
            CHAKRAVARTHI
          </h1>
          {/* Subtle text reflection/shadow behind */}
          <h1 className="text-[10vw] md:text-[12vw] ape-heading absolute top-2 left-1/2 -translate-x-1/2 text-dandy-900/10 blur-sm -z-10 whitespace-nowrap">
            CHAKRAVARTHI
          </h1>
        </motion.div>

        {/* SUBTITLE */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-3xl font-sans text-dandy-600 mt-2 mb-8 tracking-wide font-light max-w-3xl"
        >
          FULL-STACK DEVELOPER <span className="text-dandy-900 mx-2">/</span> MACHINE LEARNING <span className="text-dandy-900 mx-2">/</span> UI ENTHUSIAST
        </motion.p>

        {/* ACTION BUTTONS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(58,36,8,1)', color: '#FFFAF0' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResumeDownload}
            className="px-10 py-4 bg-dandy-950/5 backdrop-blur-md border border-dandy-950/15 rounded-full font-sans font-semibold text-lg tracking-widest uppercase flex items-center gap-3 transition-colors text-dandy-950"
          >
            <Download size={22} />
            DOWNLOAD RESUME
          </motion.button>
          
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(212,167,106,0.15)', borderColor: '#C08B3E' }}
                className={`w-14 h-14 rounded-full bg-dandy-950/5 backdrop-blur-md border border-dandy-950/10 flex items-center justify-center transition-all text-dandy-950
                  ${link.name === "LeetCode" ? "hidden md:flex" : ""}`}
              >
                {getSocialIcon(link.name)}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* IMAGE/AVATAR SECTION (Larger, floating bottom) */}
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.7 }}
           className="mt-12 relative animate-float"
        >
           <div className="w-64 h-64 md:w-80 md:h-80 rounded-full p-2 border border-dandy-950/10 glass-card tilt-3d relative overflow-hidden">
             <div className="absolute inset-0 bg-dandy-300/10 rounded-full blur-xl"></div>
             <img
               src="https://res.cloudinary.com/dhsfdcsbi/image/upload/v1763888147/chakri_jgazdv.png"
               alt="Profile"
               className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-500 ring-2 ring-dandy-200/20"
             />
           </div>
           <div className="absolute -bottom-10 -right-10 w-32 h-32 opacity-40">
              <Lottie
                animationData={handAnim}
                loop={true}
                autoplay={true}
              />
           </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
