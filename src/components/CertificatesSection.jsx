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
    <section className="py-20 relative bg-gradient-to-b from-black via-blue-900/20 to-purple-900/20">
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
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Certificates & Achievements
          </h2>
          <p className="text-white/70 text-lg">Recognition and milestones</p>
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
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-white font-semibold mb-3 group-hover:text-purple-300 transition-colors">
                  {cert.title}
                </h3>

                <div className="flex items-center text-white/50 text-sm group-hover:text-purple-400 transition-colors">
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
