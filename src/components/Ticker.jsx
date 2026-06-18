import { tickerItems } from '../data/ticker';

const Ticker = () => {
  // Duplicate enough times for seamless loop
  const items = [
    ...tickerItems,
    ...tickerItems,
    ...tickerItems,
    ...tickerItems,
    ...tickerItems,
    ...tickerItems,
  ];

  return (
    <div className="w-full bg-transparent py-12 overflow-hidden border-y border-dandy-950/10 relative select-none">
      <div className="ticker-track py-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-center px-10 py-6 glass-card flex-shrink-0 transition-all duration-300 transform-gpu hover:-translate-y-2"
            style={{
              minWidth: "340px",
              background: "rgba(255, 248, 235, 0.55)",
              borderColor: "rgba(212, 167, 106, 0.25)",
              boxShadow: "0 15px 35px rgba(28, 17, 8, 0.04)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-[#C08B3E]/10 border border-[#C08B3E]/30 rounded-full text-xs font-sans font-extrabold text-[#7A5316] tracking-[0.15em] uppercase">
                {item.label}
              </span>
              {/* Sleek geometric dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4A76A]" />
            </div>

            <h3 
              className="text-2xl md:text-3xl font-sans font-semibold text-[#1C1108] tracking-wide uppercase mb-1"
              style={{
                textShadow: "0.5px 0.5px 0px rgba(192, 139, 62, 0.15)"
              }}
            >
              {item.role}
            </h3>

            <p className="text-base md:text-lg font-sans font-medium text-[#3A2408]/85">
              {item.company}
            </p>
            <p className="text-xs md:text-sm font-mono text-[#3A2408]/60 mt-1 uppercase tracking-wider">
              {item.duration}
            </p>
          </div>
        ))}
      </div>
      <style>{`
        .ticker-track {
          display: flex;
          gap: 3.5rem;
          white-space: nowrap;
          animation: ticker-scroll 45s linear infinite;
          width: max-content;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-track > div:hover {
          box-shadow: 0 25px 50px rgba(28, 17, 8, 0.08) !important;
          border-color: rgba(212, 167, 106, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default Ticker;
