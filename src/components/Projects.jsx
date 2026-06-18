import { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import { Star } from "lucide-react";
import { projects } from "../data/projects";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const Projects = () => {
  const clickAudioRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  const playClickSound = () => {
    if (isUserInteractingRef.current) {
      if (!clickAudioRef.current) {
        clickAudioRef.current = new Audio("/virtual_vibes-single-mouse-click-sound-hd-379373.mp3");
      }
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.volume = 0.95;
      clickAudioRef.current.play().catch(() => {});
      isUserInteractingRef.current = false;
    }
  };

  return (
    <section
      id="projects"
      className="py-24 relative bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl ape-heading text-glow mb-4">
            FEATURED PROJECTS
          </h2>
          <p className="text-dandy-600 text-lg font-sans uppercase tracking-widest">Building on the bleeding edge</p>
        </motion.div>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          onTouchStart={() => {
            isUserInteractingRef.current = true;
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              isUserInteractingRef.current = false;
            }, 1000);
          }}
          onClick={() => {
            isUserInteractingRef.current = true;
            setTimeout(() => {
              isUserInteractingRef.current = false;
            }, 1000);
          }}
          onNavigationNext={() => {
            isUserInteractingRef.current = true;
            setTimeout(() => {
              isUserInteractingRef.current = false;
            }, 1000);
          }}
          onNavigationPrev={() => {
            isUserInteractingRef.current = true;
            setTimeout(() => {
              isUserInteractingRef.current = false;
            }, 1000);
          }}
          onSlideChange={playClickSound}
          className="projects-swiper"
        >

          {/* FEEDRA BANNER AS A FEATURED SLIDE */}
          <SwiperSlide className="!w-[90%] md:!w-[700px]">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-[2rem] glass-card border border-stone-900/10 tilt-3d"
            >
              <div className="relative h-[450px] overflow-hidden bg-stone-950">
                <img
                  src="/assets/feedra-startup-banner.webp"
                  alt="Feedra AI Platform"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 
                    className="text-white text-3xl md:text-4xl font-sans font-semibold uppercase tracking-wider text-glow mb-2"
                    style={{
                      textShadow: "1px 1px 0px rgba(192, 139, 62, 0.4), 2px 2px 4px rgba(0,0,0,0.4)"
                    }}
                  >
                    Feedra – AI Food Waste Prevention Platform
                  </h3>
                  <p className="text-dandy-200 text-sm font-sans tracking-widest uppercase">
                    Government-Certified • NGO Collaboration • AI Prediction
                  </p>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>

          {/* REST OF YOUR PROJECTS */}
          {projects.map((project, index) => (
            <SwiperSlide key={index} className="!w-[85%] md:!w-[500px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group overflow-hidden rounded-[2rem] glass-card border border-stone-900/10 tilt-3d"
              >
                <div className="relative h-[350px] overflow-hidden bg-stone-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent opacity-90 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <h3 
                        className="text-white text-2xl md:text-3xl font-sans font-semibold uppercase tracking-wider text-glow"
                        style={{
                          textShadow: "1px 1px 0px rgba(192, 139, 62, 0.4), 2px 2px 4px rgba(0,0,0,0.4)"
                        }}
                      >
                        {project.title}
                      </h3>

                      <div className="flex items-center space-x-2 bg-dandy-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-dandy-400/30">
                        <Star size={16} className="text-dandy-200 fill-dandy-200" />
                        <span className="text-white font-sans font-bold">
                          {project.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>

      {/* INLINE STYLES FOR SWIPER */}
      <style>{`
        .projects-swiper {
          padding: 50px 0 80px;
        }
        .projects-swiper .swiper-slide {
          transition: all 0.5s ease;
        }
        .projects-swiper .swiper-pagination-bullet {
          background: rgba(28, 17, 8, 0.2);
          width: 12px;
          height: 12px;
        }
        .projects-swiper .swiper-pagination-bullet-active {
          background: #3A2408;
          width: 40px;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(58, 36, 8, 0.2);
        }
        .projects-swiper .swiper-button-next,
        .projects-swiper .swiper-button-prev {
          color: #1C1108;
          background: rgba(253, 220, 168, 0.3);
          backdrop-filter: blur(10px);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid rgba(28, 17, 8, 0.1);
        }
        .projects-swiper .swiper-button-next:hover,
        .projects-swiper .swiper-button-prev:hover {
          background: rgba(212, 167, 106, 0.3);
        }
        .projects-swiper .swiper-button-next:after,
        .projects-swiper .swiper-button-prev:after {
          font-size: 24px;
        }
      `}</style>
    </section>
  );
};

export default Projects;
