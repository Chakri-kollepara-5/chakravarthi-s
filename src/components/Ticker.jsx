import { motion } from 'framer-motion';
import { tickerItems } from '../data/ticker';

const Ticker = () => {
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm py-4 overflow-hidden border-y border-white/10">
      <motion.div
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
        className="flex space-x-12 whitespace-nowrap"
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 px-8 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
          >
            <span className="text-3xl">{item.icon}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-yellow-400 tracking-wider">
                {item.label}
              </span>
              <span className="text-white font-semibold">{item.role}</span>
              <span className="text-white/70 text-sm">
                {item.company} • {item.duration}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ticker;
