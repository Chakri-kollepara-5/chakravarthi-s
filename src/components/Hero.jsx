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
        return <Github size={20} />;
      case "LinkedIn":
        return <Linkedin size={20} />;
      case "LeetCode":
        return <LeetCodeIcon size={20} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="about-me"
      className="min-h-screen flex items-center justify-center relative pt-20 text-white"
    >
      {/* LINES BACKGROUND */}
      <div className="lines">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="line"></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-20">

        {/* LEFT TEXT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Hi, I’m{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kollepara Venkata Sri Chakravarthi
            </span>
          </h1>

          <p className="text-xl text-white/70">
            Full-Stack Developer • Machine Learning • UI Enthusiast
          </p>

          <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResumeDownload}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold flex items-center gap-2 shadow-lg"
            >
              <Download size={20} />
              Download Resume
            </motion.button>

            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20"
              >
                {getSocialIcon(link.name)}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* RIGHT IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center"
        >
          <div className="glow-wrap">

            {/* HAND ANIMATION */}
          <Lottie
  animationData={handAnim}
  loop={false}
  autoplay={true}
  className="hand-anim"
/>


            {/* IMAGE */}
            <img
              src="https://res.cloudinary.com/dhsfdcsbi/image/upload/v1763888147/chakri_jgazdv.png"
              alt="Profile"
              className="profile-img"
            />

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
