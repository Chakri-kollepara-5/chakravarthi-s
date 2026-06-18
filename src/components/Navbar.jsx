import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = ['About Me', 'Skills', 'Projects', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[90%] mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="https://i.imgur.com/WAl4dcm.png"
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-dandy-950/10"
          />
          <span className="text-dandy-950 font-display text-2xl tracking-widest uppercase">
            Chakravarthi
          </span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            <motion.button
              key={item}
              whileHover={{ y: -2 }}
              onClick={() => scrollToSection(item.toLowerCase().replaceAll(' ', '-'))}
              className="text-dandy-950/70 hover:text-dandy-950 font-sans text-sm tracking-widest uppercase transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-dandy-900 group-hover:w-full transition-all duration-300" />
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(192, 139, 62, 0.25)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('aura')}
            className="px-6 py-2 rounded-full border border-dandy-900 bg-dandy-900/10 text-dandy-950 font-sans text-sm tracking-widest uppercase transition-all backdrop-blur-md"
          >
            ◆ AURA
          </motion.button>
        </div>

        <button
          className="md:hidden text-dandy-950"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full glass-nav backdrop-blur-3xl border-t border-dandy-400/20"
          >
            <div className="px-6 py-8 flex flex-col space-y-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.toLowerCase().replaceAll(' ', '-'))}
                  className="text-left text-dandy-950/80 hover:text-dandy-950 font-display text-xl tracking-widest uppercase"
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                 onClick={() => scrollToSection('aura')}
                 className="text-left text-dandy-900 font-display text-xl tracking-widest uppercase"
              >
                ◆ AURA
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
