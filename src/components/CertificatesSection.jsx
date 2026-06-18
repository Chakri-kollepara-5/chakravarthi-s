import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { certificateLinks } from "../data/links";

const containerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};

const CertificatesSection = () => {
  return (
    <section className="py-20 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          custom={0}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl ape-heading text-glow mb-4 text-dandy-950">
            Certificates & Achievements
          </h2>
          <p className="text-dandy-600 text-lg">Recognition and milestones</p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificateLinks.map((cert, index) => (
            <motion.a
              key={index}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              custom={index * 0.1}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden rounded-2xl glass-card border border-stone-900/10 p-6 hover:border-dandy-400/50 hover:bg-white/65 hover:shadow-[0_0_30px_rgba(192,139,62,0.1)] transition-all duration-300 tilt-3d"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-dandy-300/15 to-dandy-400/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <h3 
                  className="text-dandy-950 text-xl font-medium mb-3 group-hover:text-dandy-900 transition-colors"
                  style={{
                    textShadow: "0.5px 0.5px 0px rgba(192, 139, 62, 0.3)"
                  }}
                >
                  {cert.title}
                </h3>

                <div className="flex items-center text-stone-500 text-sm group-hover:text-dandy-700 transition-colors">
                  <span>View Certificate</span>
                  <ExternalLink
                    size={14}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
