import { motion } from 'framer-motion';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { socialLinks, certificateLinks } from '../data/links';
import LeetCodeIcon from "../icons/LeetCodeIcon";

const Footer = () => {
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
    <footer className="relative pt-20 pb-10 overflow-hidden" style={{ background: '#1C1108' }}>
      <div className="absolute inset-0 bg-dandy-gradient opacity-5 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-dandy-400 to-transparent opacity-40" />

      <div className="max-w-[90%] mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">

          {/* SOCIAL ICONS / BRANDING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:col-span-2"
          >
            <h3 className="text-4xl font-display tracking-widest uppercase text-white">
              CHAKRAVARTHI
            </h3>

            <p className="text-dandy-200 leading-relaxed font-sans max-w-md uppercase tracking-wider text-sm">
              Full Stack Developer & ML Enthusiast crafting innovative digital experiences. Building the future, one line of code at a time.
            </p>

            <div className="flex items-center gap-4 flex-wrap mt-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(212,167,106,0.3)', borderColor: '#D4A76A' }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-dandy-200 transition-colors"
                >
                  {getSocialIcon(link.name)}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-display text-white tracking-widest uppercase border-b border-white/10 pb-4 inline-block w-full">Quick Links</h3>
            <ul className="space-y-3">
              {['About Me', 'Skills', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(
                        item.toLowerCase().replaceAll(" ", "-")
                      );
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-dandy-300 hover:text-white transition-colors font-sans uppercase tracking-wider text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[2px] bg-dandy-400 group-hover:w-4 transition-all duration-300" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CERTIFICATES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-display text-white tracking-widest uppercase border-b border-white/10 pb-4 inline-block w-full">Certificates</h3>

            <ul className="space-y-3">
              {certificateLinks.slice(0, 4).map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    className="text-dandy-300 hover:text-white transition-colors font-sans uppercase tracking-wider text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[2px] bg-dandy-400 group-hover:w-4 transition-all duration-300" />
                    <span>{link.title}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-dandy-400 font-sans tracking-widest text-xs uppercase">
            © {new Date().getFullYear()} KOLLEPARA VENKATA SRI CHAKRAVARTHI.
          </p>
          <p className="text-dandy-400 font-sans tracking-widest text-xs uppercase">
            DESIGNED WITH <span className="text-white">AESTHETIC FOCUS</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
