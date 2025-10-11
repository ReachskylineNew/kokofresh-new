"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ManufacturingProcess = () => {
  const [activeStage, setActiveStage] = useState("1");
  const sectionRefs = useRef({});
  const [isMobile, setIsMobile] = useState(false);

  const flowData = [
    {
      id: "1",
      image:
        "https://static.wixstatic.com/media/e7c120_d89fe093aebc4e71966f824a8ee1813e~mv2.webp/v1/fill/w_728,h_728,al_c,q_85,enc_avif,quality_auto/farm.webp",
      title: "Farm Sourcing",
      description:
        "Our process begins right at the source — partnering with trusted local farmers who cultivate pure, chemical-free ingredients. Every batch is hand-selected to ensure natural aroma, color, and nutritional integrity.",
    },
    {
      id: "2",
      image:
        "https://static.wixstatic.com/media/e7c120_802cb99a5d6b44d69357f5f330fdbbe5~mv2.webp/v1/fill/w_728,h_728,al_c,q_85,enc_avif,quality_auto/cleaned.webp",
      title: "Cleaning & Sorting",
      description:
        "Each ingredient goes through gentle, multi-stage cleaning — removing dust, stones, and impurities without affecting the grain’s natural essence. Only the freshest, most authentic ingredients move forward.",
    },
    {
      id: "3",
      image:
        "https://static.wixstatic.com/media/e7c120_862735f07aa24f1a92e47587676b3b4c~mv2.webp/v1/fill/w_728,h_728,al_c,q_85,enc_avif,quality_auto/e7c120_862735f07aa24f1a92e47587676b3b4c~mv2.webp",
      title: "Sun Drying",
      description:
        "We follow traditional sun-drying methods — a slow, natural process that locks in authentic flavor and extends shelf life without artificial preservatives. This step brings out the true aroma of every spice and pulse.",
    },
    {
      id: "4",
      image:
        "https://static.wixstatic.com/media/e7c120_e9964f47c1c449be840e2da53e1eadfb~mv2.webp/v1/fill/w_728,h_728,al_c,q_85,enc_avif,quality_auto/e7c120_e9964f47c1c449be840e2da53e1eadfb~mv2.webp",
      title: "Grinding & Blending",
      description:
        "Using cold-grind technology, ingredients are finely milled to preserve essential oils and nutrients. Expertly balanced blends are then crafted in small batches — bringing you the authentic taste of home, every time.",
    },
  ];

  // Detect if device is mobile/tablet
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Intersection Observer (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveStage(entry.target.dataset.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    flowData.forEach((item) => {
      const ref = sectionRefs.current[item.id];
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  const activeImage = flowData.find((item) => item.id === activeStage)?.image;

  return (
    <div className="flex flex-col lg:flex-row min-h-[250vh] p-6 sm:p-8 lg:p-20 bg-gradient-to-b from-[#f8f5f0] to-[#f3ede6] text-card-foreground">
      {/* Left Image Section - Desktop */}
      {!isMobile && (
        <div className="sticky top-24 lg:w-1/2 h-[calc(100vh-6rem)] flex justify-center items-center mb-8 lg:mb-0 transition-all duration-500">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt="Active Stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-100 h-100 rounded-2xl shadow-2xl transition-all duration-700 ease-in-out object-cover"
          />
        </div>
      )}

      {/* Scrollable Text Section */}
      <div
        className={`${
          isMobile ? "w-full" : "lg:w-5/12 w-full lg:ml-20"
        } flex flex-col gap-20 sm:gap-28`}
      >
        {flowData.map((item) => (
          <div
            key={item.id}
            data-id={item.id}
            ref={(el) => (sectionRefs.current[item.id] = el)}
            className="min-h-screen flex flex-col justify-center border-b border-primary/10 pb-10"
          >
            {/* Mobile Image */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex justify-center mb-6"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </motion.div>
            )}

            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <motion.div
                animate={{
                  scale: activeStage === item.id ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`${
                  activeStage === item.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground"
                } font-bold rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base shadow`}
              >
                {item.id}
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary">
                {item.title}
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl text-muted-foreground border-l pl-5 py-2.5 border-primary/20 text-justify"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturingProcess;
