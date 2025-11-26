import { motion } from "framer-motion";

const ProjectDemoVideo = ({ title, description, video }) => {
  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-white/70 max-w-3xl mx-auto text-lg"
        >
          {description}
        </motion.p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
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
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-purple-500/10 to-blue-500/10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectDemoVideo;
