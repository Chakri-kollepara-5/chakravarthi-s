import { motion } from 'framer-motion';
import { skills } from '../data/skills';

const Skills = () => {
  return (
    <section id="skills" className="py-24 relative bg-transparent overflow-hidden">
      
      <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] bg-amber-200/15 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl ape-heading text-glow mb-4 text-dandy-950">
            SKILLS & EXPERTISE
          </h2>
          <p className="text-dandy-600 text-lg font-sans uppercase tracking-widest">Technologies I work with</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] glass-card border border-stone-900/10 p-8 flex flex-col items-center justify-center h-full tilt-3d hover:border-dandy-400/40 hover:bg-white/65 hover:shadow-[0_0_30px_rgba(192,139,62,0.12)]">
                
                <div className="absolute inset-0 bg-gradient-to-b from-dandy-300/0 to-dandy-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-dandy-950/5 backdrop-blur-md p-3 border border-dandy-950/10 group-hover:border-dandy-400/50 transition-all duration-500 flex items-center justify-center shadow-lg">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <h3 
                    className="text-dandy-950 font-sans font-medium text-xl tracking-wider uppercase text-center group-hover:text-dandy-900 transition-colors"
                    style={{
                      textShadow: "0.5px 0.5px 0px rgba(192,139,62,0.3)"
                    }}
                  >
                    {skill.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
