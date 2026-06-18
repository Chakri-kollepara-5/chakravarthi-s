import { motion } from "framer-motion";

const ProjectDemoVideo = ({ title, description, video }) => {
  return (
    <section className="relative pt-32 pb-36 px-4 bg-[#0F0A04] overflow-visible">
      {/* Curved Divider Top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-[0] pointer-events-none z-10 -translate-y-[95%]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[45px] md:h-[110px] block">
          <path d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z" fill="#0F0A04" />
        </svg>
      </div>

      {/* Curved Divider Bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] pointer-events-none z-10 translate-y-[95%]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[45px] md:h-[110px] block">
          <path d="M0,0 L1440,0 L1440,120 C960,0 480,0 0,120 Z" fill="#0F0A04" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-20">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl ape-heading text-glow"
          style={{
            background: "linear-gradient(135deg, #FFF7ED 0%, #FDDCA8 50%, #D4A76A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[#FFFAF0]/70 max-w-3xl mx-auto text-lg leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden glass-card border border-stone-100/10 shadow-2xl tilt-3d"
          style={{ background: "rgba(28, 17, 8, 0.4)" }}
        >
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-2xl"
          ></video>

          {/* Glow Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-dandy-300/5 to-dandy-500/5"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDemoVideo;
