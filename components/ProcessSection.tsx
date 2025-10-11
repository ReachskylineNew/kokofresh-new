"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const ManufacturingProcess = () => {
  const [activeStage, setActiveStage] = useState("1")
  const sectionRefs = useRef({})
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const [headerOffset, setHeaderOffset] = useState(64)
  const [stepperHeight, setStepperHeight] = useState(0)

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
  ]

  // Detect if device is mobile/tablet
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Intersection Observer (desktop only)
  useEffect(() => {
    if (isMobile) return

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveStage(entry.target.dataset.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    flowData.forEach((item) => {
      const ref = sectionRefs.current[item.id]
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [isMobile])

  // Intersection Observer for mobile to update active step while scrolling
  useEffect(() => {
    if (!isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStage(entry.target.dataset.id)
          }
        })
      },
      {
        root: null,
        threshold: 0.6,
        rootMargin: "-20% 0px -20% 0px",
      },
    )

    flowData.forEach((item) => {
      const ref = sectionRefs.current[item.id]
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [isMobile])

  // Detect if user prefers reduced motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduceMotion(mql.matches)
    onChange()
    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [])

  // Measure fixed/sticky site header and stepper height on mobile
  useEffect(() => {
    if (!isMobile) return
    const measure = () => {
      try {
        // Find highest fixed/sticky header at top:0 (Navigation, etc.)
        const candidates = Array.from(document.querySelectorAll("header, [data-header], nav")) as HTMLElement[]
        const topAnchored = candidates.filter((el) => {
          const s = getComputedStyle(el)
          return (s.position === "fixed" || s.position === "sticky") && Number.parseInt(s.top || "0", 10) === 0
        })
        const headerH = topAnchored.length ? Math.max(...topAnchored.map((el) => el.getBoundingClientRect().height)) : 0
        // Sensible default plus any detected header height
        setHeaderOffset(Math.max(56, headerH))
        setStepperHeight(stepperRef.current?.getBoundingClientRect().height || 0)
      } catch {
        // Fallback if anything goes wrong
        setHeaderOffset(56)
        setStepperHeight(stepperRef.current?.getBoundingClientRect().height || 0)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [isMobile])

  const activeIndex = flowData.findIndex((i) => i.id === activeStage)
  const goToStep = (id: string) => {
    const target = sectionRefs.current[id] as HTMLElement | undefined
    if (!target) return
    if (isMobile) {
      const y = window.scrollY + target.getBoundingClientRect().top - (headerOffset + stepperHeight + 12)
      window.scrollTo({ top: y, behavior: "smooth" })
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const activeImage = flowData.find((item) => item.id === activeStage)?.image

  const fadeUp = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8 },
  }
  const imgTransition = { duration: reduceMotion ? 0 : 0.6 }

  return (
    <div
      ref={containerRef}
      className="relative lg:pt-28 flex flex-col lg:flex-row lg:min-h-[250vh] p-6 sm:p-8 lg:p-20 bg-gradient-to-b from-[#f8f5f0] to-[#f3ede6] text-card-foreground"
    >
      {/* Process Heading */}
      <motion.div
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={fadeUp.transition}
        className={
          isMobile
            ? "relative w-full text-center mb-3 sm:mb-4 z-10"
            : "absolute top-10 left-1/2 -translate-x-1/2 transform text-center z-10"
        }
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-2">Our Process</h1>
        <p className="text-lg sm:text-xl text-muted-foreground font-medium">
          The <span className="text-primary font-semibold">Kokofresh</span> Way — from Farm to Pack
        </p>
      </motion.div>

      {/* Mobile stepper: quick navigation between steps */}
      {isMobile && (
        <div className="sticky z-20 mb-3 -mt-1" style={{ top: headerOffset }}>
          <nav
            ref={stepperRef}
            aria-label="Process steps"
            role="navigation"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                const next = Math.min(activeIndex + 1, flowData.length - 1)
                goToStep(flowData[next].id)
              } else if (e.key === "ArrowLeft") {
                const prev = Math.max(activeIndex - 1, 0)
                goToStep(flowData[prev].id)
              }
            }}
            className="rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 py-2 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              {flowData.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(step.id)}
                  aria-label={`Go to ${step.title}`}
                  aria-current={activeStage === step.id ? "step" : undefined}
                  className={`${
                    activeStage === step.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted text-muted-foreground"
                  } w-9 h-9 rounded-full text-sm font-bold grid place-items-center transition-colors`}
                >
                  {step.id}
                </button>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted relative overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-primary transition-[width]"
                style={{ width: `${((activeIndex + 1) / flowData.length) * 100}%` }}
              />
            </div>
          </nav>
          {/* Live region for screen readers */}
          <div className="sr-only" aria-live="polite">
            Step {activeIndex + 1} of {flowData.length}: {flowData[activeIndex]?.title}
          </div>
        </div>
      )}

      {/* Left Image Section - Desktop */}
      {!isMobile && (
        <div className="sticky top-24 lg:w-1/2 h-[calc(100vh-6rem)] flex justify-center items-center mb-8 lg:mb-0 transition-all duration-500">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt="Active Stage"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={imgTransition}
            className="w-100 h-100 rounded-2xl shadow-2xl transition-all duration-700 ease-in-out object-cover"
          />
        </div>
      )}

      {/* Scrollable Text Section */}
      <div
        className={`${
          isMobile ? "w-full snap-y snap-proximity" : "lg:w-5/12 w-full lg:ml-20"
        } flex flex-col ${isMobile ? "gap-10" : "gap-20 sm:gap-28"}`}
      >
        {flowData.map((item) => (
          <div
            key={item.id}
            data-id={item.id}
            ref={(el) => (sectionRefs.current[item.id] = el)}
            className={`flex flex-col justify-center border-b border-primary/10 pb-10 ${
              isMobile
                ? "min-h-[60vh] snap-start rounded-2xl border border-foreground/10 bg-background/70 shadow-sm p-4"
                : "min-h-[80vh]"
            }`}
            style={isMobile ? { scrollMarginTop: headerOffset + stepperHeight + 16 } : undefined}
          >
            {/* Mobile Image */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5 }}
                viewport={{ once: true, amount: 0.4 }}
                className="flex justify-center mb-4"
              >
                <img
                  src={item.image || "/placeholder.svg?height=728&width=728&query=manufacturing process image"}
                  alt={item.title}
                  loading={item.id === "1" ? "eager" : "lazy"}
                  decoding="async"
                  width={728}
                  height={728}
                  sizes="(max-width: 640px) 100vw, 728px"
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </motion.div>
            )}

            <div className="flex items-center gap-3 mb-3 sm:mb-5">
              {isMobile ? (
                <button
                  type="button"
                  onClick={() => goToStep(item.id)}
                  aria-label={`Focus ${item.title}`}
                  aria-current={activeStage === item.id ? "step" : undefined}
                  className={`${
                    activeStage === item.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  } font-bold rounded-full w-10 h-10 flex items-center justify-center text-base shadow`}
                >
                  {item.id}
                </button>
              ) : (
                <motion.div
                  animate={{ scale: activeStage === item.id ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`${
                    activeStage === item.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  } font-bold rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base shadow`}
                >
                  {item.id}
                </motion.div>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary">{item.title}</h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
              viewport={{ once: true, amount: 0.4 }}
              className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl text-muted-foreground border-l pl-5 py-2.5 border-primary/20 text-justify"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManufacturingProcess
