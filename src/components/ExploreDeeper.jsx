import { motion } from "framer-motion";
import { socialLinks, resumeUrl } from "../data/links";

const linkedInUrl = socialLinks.find(l => l.name === "LinkedIn")?.url || "#";

const ExploreDeeper = () => {
  return (
    <section className="relative py-32 overflow-hidden" id="explore-deeper">

      {/* MASSIVE BACKGROUND TEXT — 3D depth layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[22vw] md:text-[18vw] font-display uppercase leading-none tracking-tighter whitespace-nowrap"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(192,139,62,0.12)",
          }}
        >
          EXPLORE
        </motion.h2>
      </div>

      {/* FLOATING 3D ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large tilted ring */}
        <motion.div
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-16 right-[10%] w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border-[2px] border-dandy-400/15"
          style={{ transform: "rotateX(70deg)", transformStyle: "preserve-3d" }}
        />

        {/* Floating orb */}
        <motion.div
          animate={{ y: [-25, 25, -25], x: [-10, 10, -10] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[6%] w-20 h-20 rounded-full hidden md:block"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(253,220,168,0.7), rgba(212,167,106,0.15) 60%, transparent)",
            boxShadow: "0 15px 50px rgba(192,139,62,0.12)",
          }}
        />

        {/* Second ring, smaller */}
        <motion.div
          animate={{ rotateZ: [360, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[15%] w-[100px] h-[100px] rounded-full border-[2px] border-dandy-300/20 hidden lg:block"
          style={{ transform: "rotateX(55deg) rotateY(25deg)", transformStyle: "preserve-3d" }}
        />

        {/* Scattered particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [-15, 15, -15], opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 3.5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-dandy-500/30"
            style={{ left: `${8 + i * 11}%`, top: `${15 + (i % 4) * 20}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADING — BIG & EDITORIAL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-dandy-600 text-sm md:text-base font-sans uppercase tracking-[0.3em] mb-4">
            For detailed projects, check out
          </p>
          <h2 className="text-6xl md:text-9xl ape-heading text-glow text-dandy-950 mb-6">
            MY PROFILES
          </h2>
        </motion.div>

        {/* TWO MASSIVE 3D CARDS — SIDE BY SIDE */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">

          {/* ═══════ LINKEDIN CARD ═══════ */}
          <motion.a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 60, rotateY: -8 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              rotateX: -4,
              rotateY: 6,
              y: -12,
              scale: 1.02,
            }}
            className="group relative block rounded-[2.5rem] overflow-hidden cursor-pointer min-h-[420px] md:min-h-[480px]"
            style={{
              background: "rgba(255,248,235,0.5)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(212,167,106,0.2)",
              boxShadow: "0 30px 80px rgba(28,17,8,0.05)",
              transformStyle: "preserve-3d",
              perspective: "1200px",
            }}
            id="explore-linkedin-card"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-dandy-200/30 via-transparent to-dandy-300/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Corner light */}
            <div className="absolute top-0 left-0 w-[60%] h-[2px] bg-gradient-to-r from-dandy-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-[2px] h-[40%] bg-gradient-to-b from-dandy-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-14">
              {/* TOP — Big typography */}
              <div>
                <motion.div
                  className="text-[80px] md:text-[120px] font-sans font-semibold leading-[0.85] tracking-tighter text-dandy-950 mb-2 group-hover:tracking-tight transition-all duration-500"
                  style={{ 
                    transformStyle: "preserve-3d",
                    textShadow: "1px 1px 0px rgba(192, 139, 62, 0.2), 2px 2px 0px rgba(192, 139, 62, 0.1)"
                  }}
                >
                  LINKED
                  <br />
                  <span style={{
                    background: "linear-gradient(135deg, #3A2408, #7A5316)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>IN</span>
                </motion.div>
              </div>

              {/* BOTTOM — Info + CTA */}
              <div>
                <p className="text-dandy-700/70 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                  Project walkthroughs, hackathon wins, certifications, and professional milestones.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-dandy-950 font-bold text-sm tracking-[0.25em] uppercase group-hover:tracking-[0.35em] transition-all duration-500">
                    VIEW PROFILE
                  </span>
                  <motion.span
                    className="text-3xl text-dandy-400 group-hover:text-dandy-900 group-hover:translate-x-2 transition-all duration-500"
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Floating pill */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8 px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{
                background: "rgba(212,167,106,0.12)",
                border: "1px solid rgba(212,167,106,0.25)",
                color: "#7A5316",
              }}
            >
              500+
            </motion.div>
          </motion.a>

          {/* ═══════ RESUME CARD ═══════ */}
          <motion.a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 60, rotateY: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              rotateX: -4,
              rotateY: -6,
              y: -12,
              scale: 1.02,
            }}
            className="group relative block rounded-[2.5rem] overflow-hidden cursor-pointer min-h-[420px] md:min-h-[480px]"
            style={{
              background: "linear-gradient(155deg, #3A2408 0%, #1C1108 40%, #0F0A04 100%)",
              border: "1px solid rgba(212,167,106,0.1)",
              boxShadow: "0 30px 80px rgba(28,17,8,0.15)",
              transformStyle: "preserve-3d",
              perspective: "1200px",
            }}
            id="explore-resume-card"
          >
            {/* Warm ambient glow */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700"
              style={{
                background: "radial-gradient(ellipse at 15% 85%, rgba(212,167,106,0.2), transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(253,220,168,0.08), transparent 50%)",
              }}
            />

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.025] group-hover:opacity-[0.05] transition-opacity duration-700"
              style={{
                backgroundImage: "linear-gradient(rgba(253,220,168,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(253,220,168,0.6) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            {/* Corner light */}
            <div className="absolute bottom-0 right-0 w-[60%] h-[2px] bg-gradient-to-l from-dandy-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-[2px] h-[40%] bg-gradient-to-t from-dandy-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-10 md:p-14">
              {/* TOP — Big typography */}
              <div>
                <motion.div
                  className="text-[80px] md:text-[120px] font-sans font-semibold leading-[0.85] tracking-tighter text-dandy-100 mb-2 group-hover:tracking-tight transition-all duration-500"
                  style={{ 
                    transformStyle: "preserve-3d",
                    textShadow: "1px 1px 0px rgba(28, 17, 8, 0.8), 2px 2px 0px rgba(28, 17, 8, 0.6)"
                  }}
                >
                  RÉS
                  <br />
                  <span style={{
                    background: "linear-gradient(135deg, #FDDCA8, #D4A76A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>UMÉ</span>
                </motion.div>
              </div>

              {/* BOTTOM — Info + CTA */}
              <div>
                <p className="text-dandy-400/70 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                  Complete work history, technical skills, education, and project highlights — one clean PDF.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-dandy-200 font-bold text-sm tracking-[0.25em] uppercase group-hover:tracking-[0.35em] transition-all duration-500">
                    DOWNLOAD PDF
                  </span>
                  <motion.span
                    className="text-3xl text-dandy-500/50 group-hover:text-dandy-200 group-hover:translate-x-2 transition-all duration-500"
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Floating pill */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8 px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{
                background: "rgba(212,167,106,0.08)",
                border: "1px solid rgba(212,167,106,0.15)",
                color: "#D4A76A",
              }}
            >
              2025
            </motion.div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ExploreDeeper;
