import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Laptop, MessageCircle, Star, Sparkles, Code2, Users, Shield, CheckCircle, GraduationCap, TrendingUp } from "lucide-react";
import { ThreeHero } from "@/components/project/ThreeHero";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Typewriter } from "@/components/motion/Typewriter";
import { useStats, useProjects } from "@/api/catalog";
import { ProjectCard } from "@/components/project/ProjectCard";
import { FeaturedCarousel } from "@/components/project/FeaturedCarousel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BorderGlow } from "@/components/ui/BorderGlow";
import { categoryMeta } from "@/lib/constants";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function ProductWalkthrough() {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 4001);
    return () => clearInterval(interval);
  }, [reduced]);

  const stepsInfo = [
    { title: "Browse Catalog", desc: "Explore 3,800+ project templates" },
    { title: "Filter Stream", desc: "Find exact tech stack & complexity" },
    { title: "Chat & Customize", desc: "Align with engineers on WhatsApp" },
    { title: "Instant Delivery", desc: "Get full local setup & code" }
  ];

  return (
    <div className="relative rounded-3xl border border-line bg-surface/40 p-6 shadow-2xl h-[360px] flex flex-col justify-between overflow-hidden glass">
      {/* Device Header */}
      <div className="flex items-center justify-between border-b border-line pb-4 mb-4 select-none">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="text-[11px] text-muted font-sans font-medium pl-1.5 uppercase tracking-wider">Hextorq Simulator</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${step === s ? "bg-violet-txt w-4" : "bg-line hover:bg-violet/50"
                }`}
              aria-label={`Go to step ${s + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Screen Frame content */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden bg-bg-soft/50 rounded-2xl border border-line/65 p-4 min-h-0">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col justify-between space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-fg">All Streams</span>
                <span className="text-[9px] text-faint">3,886 items</span>
              </div>
              <div className="grid grid-cols-2 gap-2 flex-grow min-h-0">
                <div className="bg-surface/60 border border-line/80 rounded-xl p-2.5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-fg line-clamp-2">Blockchain Health Platform</span>
                  <span className="text-[8px] text-violet-txt font-semibold uppercase">Blockchain</span>
                </div>
                <div className="bg-surface/60 border border-line/80 rounded-xl p-2.5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-fg line-clamp-2">Federated Learning AI</span>
                  <span className="text-[8px] text-emerald-400 font-semibold uppercase">AI / ML</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/20 border border-violet/30 text-violet-txt font-bold flex items-center gap-1 animate-pulse">
                  Stream: AI/ML ✕
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 flex-grow min-h-0">
                <div className="bg-surface/75 border border-violet/30 rounded-xl p-3 flex flex-col justify-between shadow-lg shadow-violet/5">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-fg">Privacy-Preserving Federated ML</span>
                    <span className="text-[9px] text-emerald-400 font-semibold">Premium</span>
                  </div>
                  <p className="text-[9px] text-muted line-clamp-2 font-sans">Fully decentralized machine learning model training scheme for local devices.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col justify-end space-y-3"
            >
              <div className="space-y-2 max-w-[85%] self-end">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-fg p-3 rounded-2xl rounded-tr-none text-[10px] leading-relaxed shadow-md shadow-black/5 font-sans">
                  <span className="font-bold text-emerald-400 block mb-0.5">WhatsApp Inquiry</span>
                  Hi Hextorq, I'm interested in the Federated ML project. Can you customize the smart contract module?
                </div>
              </div>
              <div className="space-y-2 max-w-[85%] self-start">
                <div className="bg-surface-hi/80 border border-line text-fg p-3 rounded-2xl rounded-tl-none text-[10px] leading-relaxed shadow-md font-sans">
                  <span className="font-bold text-violet-txt block mb-0.5">Hextorq Engineer</span>
                  Yes, absolutely! We can configure the encryption layers and set it up locally for your review.
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="h-16 w-16 bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-fg font-display">Project Sync Complete!</h4>
                <p className="text-[9px] text-muted max-w-[200px] mx-auto mt-0.5 font-sans">
                  Full codebase, ER diagrams, SRS document, and DB scripts successfully delivered.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Device Footer status text */}
      <div className="mt-4 flex justify-between items-center text-[10px] text-faint select-none">
        <span className="font-semibold text-fg">Step {step + 1}: {stepsInfo[step].title}</span>
        <span>{stepsInfo[step].desc}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: stats } = useStats();
  const { data: premiumData } = useProjects({ tier: "Premium" });
  const premiumPool = premiumData?.items.slice(0, 6) || [];
  const { data: hotData } = useProjects({ sort: "importance", perPage: 8 });
  const hotProjects = hotData?.items || [];

  const [startIndex, setStartIndex] = useState(0);
  const [isSpotlightHovered, setIsSpotlightHovered] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (premiumPool.length <= 3 || isSpotlightHovered || reduced) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % premiumPool.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [premiumPool.length, isSpotlightHovered, reduced]);

  const getVisibleProjects = () => {
    if (premiumPool.length === 0) return [];
    if (premiumPool.length <= 3) return premiumPool;
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(premiumPool[(startIndex + i) % premiumPool.length]);
    }
    return items;
  };
  const displayedPremium = getVisibleProjects();

  const [streamsList, setStreamsList] = useState([
    { name: "AI/ML & Data Science", desc: "Predictive modeling, deep learning, computer vision, and analytics dashboards.", count: 1705 },
    { name: "Web Applications & Portals", desc: "Modern full-stack web architectures using React, Node, and secure REST APIs.", count: 364 },
    { name: "IoT, Embedded & Robotics", desc: "Sensors integrations, raspberry pi/arduino controllers, and real-time streams.", count: 339 },
    { name: "Cybersecurity & Cloud Security", desc: "Cryptographic protection, zero-knowledge proofs, and secure cloud environments.", count: 132 },
    { name: "Blockchain & Decentralized Systems", desc: "Solidity smart contracts, Web3 dApps, and distributed ledger configurations.", count: 50 },
    { name: "Mobile Applications", desc: "Cross-platform mobile apps for Android and iOS using React Native / Flutter.", count: 195 },
  ]);

  const [isStreamsHovered, setIsStreamsHovered] = useState(false);

  useEffect(() => {
    if (reduced || isStreamsHovered) return;
    // Slot order around the 3×2 grid, walked clockwise. Each tick shifts every
    // card one slot along this ring so the whole grid rotates clockwise, one
    // card at a time, and framer's `layout` tweens each move smoothly.
    const ring = [0, 1, 2, 5, 4, 3];
    const interval = setInterval(() => {
      setStreamsList((prev) => {
        if (prev.length < ring.length) {
          const next = [...prev];
          const first = next.shift();
          if (first) next.push(first);
          return next;
        }
        const next = [...prev];
        for (let k = 0; k < ring.length; k++) {
          next[ring[(k + 1) % ring.length]] = prev[ring[k]];
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [reduced, isStreamsHovered]);

  const deliverables = [
    {
      title: "System Setups",
      desc: "Get remote desktop setup support. We install NodeJS, databases, environment parameters, and ensure the project boots correctly on your system.",
      icon: Laptop,
      color: "violet" as const,
    },
    {
      title: "Full Handoffs",
      desc: "Receive 100% of the deliverables: clean frontends, backends, databases schema scripts, setup files, and basic README steps. No locks, no omissions.",
      icon: Code2,
      color: "cyan" as const,
    },
    {
      title: "Viva Coaching",
      desc: "We walk you through the system flow, key database relationships, and how requests connect. Prepare to answer internal viva review committees with confidence.",
      icon: Shield,
      color: "emerald" as const,
    },
  ];

  const deliverableStyles = {
    violet: { icon: "bg-violet/15 text-violet border-violet/20", border: "hover:border-violet/40" },
    cyan: { icon: "bg-cyan/15 text-cyan border-cyan/20", border: "hover:border-cyan/40" },
    emerald: { icon: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", border: "hover:border-emerald-400/40" },
  };

  const studentReviews = [
    {
      name: "Sanjay Kumar",
      college: "RV College of Engineering, Bangalore",
      stream: "AI/ML & Data Science",
      project: "Privacy-Preserving Analytics in Healthcare using Federated Learning",
      grade: "Grade: S (Outstanding)",
      review: "Hextorq devs helped me customize the smart contract module for my review. The local setup was completely taken care of and I aced my viva with confidence!",
      rating: 5,
    },
    {
      name: "Meera Nair",
      college: "PES University, Bangalore",
      stream: "Cybersecurity & Cloud Security",
      project: "Multi-Tenant Cloud Threat Detection utilizing Deep Packet Inspection",
      grade: "Grade: A+",
      review: "Clean code structure and excellent documentation. The system flow diagrams included in the project package saved me weeks of manual drawing.",
      rating: 5,
    },
    {
      name: "Abhishek Roy",
      college: "SRM University, Chennai",
      stream: "Web Applications & Portals",
      project: "Full-Stack Microservices Platform for Decentralized E-Governance",
      grade: "Grade: Outstanding (O)",
      review: "Excellent response times on WhatsApp. They assisted with Postgres configurations and local server setup. Highly recommended for final-year guidance.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      college: "VIT, Vellore",
      stream: "IoT, Embedded & Robotics",
      project: "Smart Agriculture Monitoring with Raspberry Pi and Edge ML",
      grade: "Grade: A+",
      review: "The hardware wiring guide and the sensor calibration walkthrough were spot on. My panel was genuinely impressed with the live demo.",
      rating: 5,
    },
    {
      name: "Karthik Menon",
      college: "NIT Trichy",
      stream: "AI/ML & Data Science",
      project: "Real-Time Sign Language Translation using Computer Vision",
      grade: "Grade: S (Outstanding)",
      review: "They explained the CNN architecture line by line until I could defend every layer. Worth every rupee for the confidence it gave me.",
      rating: 5,
    },
    {
      name: "Ananya Iyer",
      college: "Anna University, Chennai",
      stream: "Enterprise & Management Systems",
      project: "AI-Powered Hospital Resource Allocation Dashboard",
      grade: "Grade: A",
      review: "Clean, well-documented code and quick setup support over WhatsApp. The ER diagrams saved me an entire weekend of report work.",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      college: "JNTU, Hyderabad",
      stream: "AI/ML & Data Science",
      project: "Medical Image Segmentation using 3D U-Net Models",
      grade: "Grade: A+",
      review: "The medical imaging AI model was highly accurate. Remote desk setup was smooth, professional, and everything compiled perfectly on my machine.",
      rating: 5,
    },
    {
      name: "Rohan Sharma",
      college: "DTU, Delhi",
      stream: "Blockchain & Cryptography",
      project: "Decentralized Voting System with Zero-Knowledge Proofs",
      grade: "Grade: S (Outstanding)",
      review: "Outstanding solidity contract setup. The DApp worked out of the box and our college viva panel was highly impressed by the security architecture.",
      rating: 5,
    },
    {
      name: "Vikram Malhotra",
      college: "IIT Bombay",
      stream: "Cybersecurity & Cloud Security",
      project: "Kubernetes Threat Monitoring with Extended BPF",
      grade: "Grade: A+",
      review: "Excellent Kubernetes threat monitoring setup. The deployment scripts and container orchestration patterns are production-grade.",
      rating: 5,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background aurora glow grid */}
      <div className="absolute inset-0 bg-bg aurora pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-8 border-b border-line/40">
        {/* Twilight Haze soft accent glow */}
        <div className="twilight-orb w-[34rem] h-[34rem] -bottom-40 -left-32 z-0" aria-hidden="true" />

        {/* Interactive WebGL Scene */}
        <ThreeHero />

        <div className="mx-auto max-w-4xl text-center space-y-6 md:space-y-8 relative z-10 pt-16">
          <Reveal delay={0.1} className="space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-fg leading-[1.05]">
              asdfghjkl;'lkjhg<br />
              Production-Ready Projects, <br />
              <Typewriter
                words={["Architected for Excellence.", "Delivered with Source Code.", "Backed by Real Mentorship.", "Viva-Ready & Documented."]}
                className="text-gradient"
              />
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted leading-relaxed">
              Explore 3,800+ premium engineering projects across major academic streams. Get complete local setup, clean source code, and direct guidance from industry-grade engineers to defend your viva with absolute confidence.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/explore">
              <Button size="lg" className="flex items-center gap-2">
                Browse Projects Catalog
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Speak with Architect
              </Button>
            </Link>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-sans text-muted mt-4 select-none">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet" />
                Elite Engineering Final-Year Projects
              </span>
              <span className="text-line hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span>💸</span>
                5%+ Off Every Project
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 -mt-10 sm:-mt-12">
        <div className="glass border border-line rounded-3xl p-6 md:p-8 bg-surface/65 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <CountUp
              value={stats?.totalProjects || 3886}
              duration={4.5}
              className="block font-display text-2xl sm:text-4xl font-bold text-fg"
              format={(n) => `${n.toLocaleString("en-IN")}+`}
            />
            <span className="text-xs sm:text-sm text-muted">Ready Source Codes</span>
          </div>
          <div className="space-y-1">
            <CountUp
              value={stats?.categories || 14}
              duration={4.5}
              className="block font-display text-2xl sm:text-4xl font-bold text-fg"
            />
            <span className="text-xs sm:text-sm text-muted">Academic Streams</span>
          </div>
          <div className="space-y-1">
            <CountUp
              value={stats?.applicationAreas || 9}
              duration={4.5}
              className="block font-display text-2xl sm:text-4xl font-bold text-fg"
            />
            <span className="text-xs sm:text-sm text-muted">Application Domains</span>
          </div>
          <div className="space-y-1">
            <CountUp
              value={stats?.premiumCount || 21}
              duration={4.5}
              className="block font-display text-2xl sm:text-4xl font-bold text-fg"
            />
            <span className="text-xs sm:text-sm text-muted">Premium Spotlights</span>
          </div>
        </div>
      </section>

      {/* What We Assure Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400 select-none">
              <Shield className="h-3.5 w-3.5" />
              Our Commitment to You
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="text-3xl font-bold font-display text-fg tracking-tight">
              What We Assure
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-sm text-muted max-w-lg mx-auto">
              We don't just hand you a zip file. We guide you through the codebase, environment setup, and theoretical design.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Reveal delay={0.1} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#a855f7"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#a855f7', '#c084fc', '#38bdf8']}
              className="h-full group cursor-pointer"
            >
              <div className="p-6 h-full flex flex-col justify-between space-y-4">
                <div className="p-3 bg-violet/10 border border-violet/20 rounded-xl inline-block w-12 h-12 text-violet-txt">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-fg text-lg">You Learn the System</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    We don't just give you code. We walk you through the system architecture and flow so you genuinely understand your project.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>

          <Reveal delay={0.2} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#06b6d4"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#06b6d4', '#38bdf8', '#a855f7']}
              className="h-full group cursor-pointer"
            >
              <div className="p-6 h-full flex flex-col justify-between space-y-4">
                <div className="p-3 bg-cyan/10 border border-cyan/20 rounded-xl inline-block w-12 h-12 text-cyan-txt">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-fg text-lg">Real Mentorship</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Get direct access to the software engineers who built your system, not a generic support ticket system.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>

          <Reveal delay={0.3} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#10b981"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#10b981', '#34d399', '#38bdf8']}
              className="h-full group cursor-pointer"
            >
              <div className="p-6 h-full flex flex-col justify-between space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-block w-12 h-12 text-emerald-400">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-fg text-lg">Viva-Ready Projects</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Our defense-focused coaching prepares you to answer tricky questions from review panels with complete confidence.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>

          <Reveal delay={0.4} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#f59e0b"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#f59e0b', '#fbbf24', '#f472b6']}
              className="h-full group cursor-pointer"
            >
              <div className="p-6 h-full flex flex-col justify-between space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl inline-block w-12 h-12 text-amber-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-fg text-lg">Grow Beyond Submission</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Use your final year project as a stepping stone to build real industry-grade skills and advance your career.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>
        </div>
      </section>

      {/* Stream Showcase Grid */}
      <section className="py-20 mx-auto max-w-7xl px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-display text-fg tracking-tight">
            Select Your Stream
          </h2>
          <p className="text-sm text-muted max-w-lg mx-auto">
            Pick a specific department stream to find standard or high-complexity source codes tailored to your curriculum.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-row-dense"
          onMouseEnter={() => setIsStreamsHovered(true)}
          onMouseLeave={() => setIsStreamsHovered(false)}
        >
          {streamsList.map((stream, idx) => {
            const meta = categoryMeta(stream.name);
            const isFeatured = stream.name.includes("AI/ML");
            return (
              <motion.div
                layout
                key={stream.name}
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{
                  layout: { type: "spring", stiffness: 60, damping: 18, mass: 1 },
                  default: { duration: 0.3 }
                }}
                className="h-full"
              >
                <Link to={`/category/${encodeURIComponent(stream.name)}`} className="block h-full">
                  <BorderGlow
                    edgeSensitivity={35}
                    glowColor={meta.color}
                    backgroundColor="var(--color-surface)"
                    borderRadius={24}
                    glowRadius={40}
                    glowIntensity={1.2}
                    coneSpread={30}
                    colors={[meta.color, '#a7b7e7', '#d8e2ff']}
                    className="h-full group hover:border-violet/40 hover:bg-surface-hi/40 transition-all cursor-pointer"
                  >
                    <div className="h-full flex flex-col justify-between p-6 min-h-[190px]">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span
                            className="h-2 w-2 rounded-full animate-pulse"
                            style={{ backgroundColor: meta.color }}
                          />
                          <div className="flex gap-1.5 items-center">
                            {isFeatured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet/10 border border-violet/20 text-violet-txt">
                                Most Popular Stream
                              </span>
                            )}
                            <span className="text-xs font-semibold text-faint">
                              {stream.count} Projects
                            </span>
                          </div>
                        </div>
                        <h3 className="font-display font-semibold text-fg text-lg group-hover:text-cyan-txt transition-colors">
                          {meta.short}
                        </h3>
                        <p className="text-xs text-muted leading-relaxed">
                          {stream.desc}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-xs text-violet-txt font-semibold group-hover:translate-x-1.5 transition-transform">
                        Browse Stream
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </BorderGlow>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Premium Spotlights */}
      {displayedPremium.length > 0 && (
        <section className="relative overflow-hidden py-16 bg-surface-hi/15 border-y border-line/40">
          <div className="twilight-orb w-[30rem] h-[30rem] -top-44 right-0" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-tier-premium tracking-wider uppercase">
                  <Star className="h-4 w-4 fill-current animate-spin-slow" />
                  Premium Catalogs
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-fg tracking-tight">
                  Spotlight Projects
                </h2>
                <p className="text-sm text-muted max-w-md">
                  Explore high-depth architectures ideal for advanced student submissions and top tier reviews.
                </p>
              </div>
              <Link to="/explore?tier=Premium">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Explore All Premium
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              onMouseEnter={() => setIsSpotlightHovered(true)}
              onMouseLeave={() => setIsSpotlightHovered(false)}
            >
              <AnimatePresence mode="popLayout">
                {displayedPremium.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 55 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -55 }}
                    transition={{ type: "spring", stiffness: 130, damping: 20 }}
                  >
                    <ProjectCard project={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section / Deployment Sandbox */}
      <section className="py-20 bg-bg-soft/40 border-b border-line/40 relative">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan uppercase tracking-wide">
                <Laptop className="h-3.5 w-3.5" />
                Interactive Showcase
              </div>
              <h2 className="text-3xl font-bold font-display text-fg tracking-tight">
                Get Up & Running In Seconds.
              </h2>
              <p className="text-sm text-muted">
                Hextorq projects are packaged for seamless deployments. We handle full database setups, script configs, and environment wiring so you get a functional local demo environment instantly.
              </p>
            </div>

            {/* Simple Step Milestones */}
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/10 border border-violet/20 text-xs font-bold text-violet shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-display font-semibold text-fg text-sm">Select Your Project</h4>
                  <p className="text-xs text-muted mt-0.5 font-sans">Filter by streams, tier, or domain complexity in our extensive 3,800+ list.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/10 border border-cyan/20 text-xs font-bold text-cyan shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-display font-semibold text-fg text-sm">Enquire & Customize</h4>
                  <p className="text-xs text-muted mt-0.5 font-sans">Connect on WhatsApp with our engineers to align deliverables and adjustments.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-display font-semibold text-fg text-sm">Local Handoff & Viva Prep</h4>
                  <p className="text-xs text-muted mt-0.5 font-sans">We guide your installation locally and prepare you to explain the code workflow.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Simulated Walkthrough */}
          <Reveal delay={0.2}>
            <ProductWalkthrough />
          </Reveal>
        </div>
      </section>

      {/* Deliverables Info Grid */}
      <section className="py-20 mx-auto max-w-7xl px-4 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight">
            Academic Delivery Package
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            We provide a complete software package, ensuring you can explain and run the code with zero issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deliverables.map((d, idx) => {
            const s = deliverableStyles[d.color];
            const Icon = d.icon;
            const glowColor = d.color === "violet" ? "#a855f7" : d.color === "cyan" ? "#06b6d4" : "#10b981";
            const borderColors = d.color === "violet"
              ? ['#a855f7', '#c084fc', '#38bdf8']
              : d.color === "cyan"
                ? ['#06b6d4', '#38bdf8', '#a855f7']
                : ['#10b981', '#34d399', '#38bdf8'];

            return (
              <Reveal key={d.title} delay={idx * 0.08}>
                <BorderGlow
                  edgeSensitivity={30}
                  glowColor={glowColor}
                  backgroundColor="var(--color-surface)"
                  borderRadius={20}
                  glowRadius={40}
                  glowIntensity={0.8}
                  coneSpread={25}
                  colors={borderColors}
                  className="h-full group cursor-pointer"
                >
                  <div className="p-6 h-full flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div
                        className={`p-3 rounded-xl inline-block border mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${s.icon}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-semibold text-fg text-lg">{d.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                </BorderGlow>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Student Success Stories & Reviews Testimonials Section */}
      <section className="py-20 bg-surface-hi/5 border-y border-line/40 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-16">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-xs font-semibold text-cyan select-none">
              <CheckCircle className="h-3.5 w-3.5" />
              100% Verified Student Reviews
            </div>
            <h2 className="text-3xl font-bold font-display text-fg tracking-tight">
              What Our Alumni Say
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Read how final-year students from top universities successfully deployed their code and aced their assessments.
            </p>
          </div>

          {/* Infinite auto-scrolling vertical columns of review cards (keeps moving on hover). */}
          <div className="marquee-y-mask relative h-[660px] overflow-hidden py-4 max-w-[960px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {/* Column 1 (Left): Scrolls Down */}
              <div
                className="flex flex-col gap-6 animate-marquee-y-down"
                style={{ "--marquee-duration": "32s" } as CSSProperties}
              >
                {[...studentReviews.filter((_, i) => i % 3 === 0), ...studentReviews.filter((_, i) => i % 3 === 0)].map((rev, idx) => (
                  <div key={idx} className="shrink-0">
                    <Card className="bg-surface/30 backdrop-blur-md border border-line p-5 flex flex-col justify-between hover:border-violet/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet/5 blur-2xl group-hover:bg-violet/10 transition-colors" />

                      <div className="space-y-4">
                        {/* Header: Profile, Username/College, and Twitter Icon */}
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center font-display text-white font-bold text-sm">
                            {rev.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-fg truncate">{rev.name}</h4>
                            <p className="text-[10px] text-muted truncate">@{rev.name.replace(/\s+/g, "").toLowerCase()}_dev</p>
                          </div>
                          <svg className="h-4 w-4 text-faint shrink-0 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>

                        {/* Review text */}
                        <p className="text-xs md:text-sm text-muted leading-relaxed font-sans">
                          "{rev.review}"
                        </p>
                      </div>

                      <div className="mt-6 space-y-2 pt-4 border-t border-line/45">
                        <div className="text-[10px] text-cyan font-medium truncate">
                          Project: {rev.project}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-[#f5b944] text-[#f5b944]" />
                            ))}
                          </div>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                            {rev.grade}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Column 2 (Middle): Scrolls Up */}
              <div
                className="hidden md:flex flex-col gap-6 animate-marquee-y-up"
                style={{ "--marquee-duration": "28s" } as CSSProperties}
              >
                {[...studentReviews.filter((_, i) => i % 3 === 1), ...studentReviews.filter((_, i) => i % 3 === 1)].map((rev, idx) => (
                  <div key={idx} className="shrink-0">
                    <Card className="bg-surface/30 backdrop-blur-md border border-line p-5 flex flex-col justify-between hover:border-violet/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet/5 blur-2xl group-hover:bg-violet/10 transition-colors" />

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center font-display text-white font-bold text-sm">
                            {rev.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-fg truncate">{rev.name}</h4>
                            <p className="text-[10px] text-muted truncate">@{rev.name.replace(/\s+/g, "").toLowerCase()}_dev</p>
                          </div>
                          <svg className="h-4 w-4 text-faint shrink-0 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>

                        <p className="text-xs md:text-sm text-muted leading-relaxed font-sans">
                          "{rev.review}"
                        </p>
                      </div>

                      <div className="mt-6 space-y-2 pt-4 border-t border-line/45">
                        <div className="text-[10px] text-cyan font-medium truncate">
                          Project: {rev.project}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-[#f5b944] text-[#f5b944]" />
                            ))}
                          </div>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                            {rev.grade}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Column 3 (Right): Scrolls Down */}
              <div
                className="hidden lg:flex flex-col gap-6 animate-marquee-y-down"
                style={{ "--marquee-duration": "35s" } as CSSProperties}
              >
                {[...studentReviews.filter((_, i) => i % 3 === 2), ...studentReviews.filter((_, i) => i % 3 === 2)].map((rev, idx) => (
                  <div key={idx} className="shrink-0">
                    <Card className="bg-surface/30 backdrop-blur-md border border-line p-5 flex flex-col justify-between hover:border-violet/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet/5 blur-2xl group-hover:bg-violet/10 transition-colors" />

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center font-display text-white font-bold text-sm">
                            {rev.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-fg truncate">{rev.name}</h4>
                            <p className="text-[10px] text-muted truncate">@{rev.name.replace(/\s+/g, "").toLowerCase()}_dev</p>
                          </div>
                          <svg className="h-4 w-4 text-faint shrink-0 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>

                        <p className="text-xs md:text-sm text-muted leading-relaxed font-sans">
                          "{rev.review}"
                        </p>
                      </div>

                      <div className="mt-6 space-y-2 pt-4 border-t border-line/45">
                        <div className="text-[10px] text-cyan font-medium truncate">
                          Project: {rev.project}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-[#f5b944] text-[#f5b944]" />
                            ))}
                          </div>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                            {rev.grade}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 mx-auto max-w-5xl px-4 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-violet/30 bg-surface p-8 md:p-12 shadow-2xl glow-violet">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet/15 blur-[60px]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl md:text-3.5xl font-bold font-display text-fg tracking-tight">
              Ready to Secure Your Project Deliverables?
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Explore our exhaustive list of 3,800+ projects or contact Hextorq IT architects to design custom solutions. Pay only after aligning on exact details.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center">
              <Link to="/explore">
                <Button size="md" className="flex items-center gap-2">
                  Browse Catalog Grid
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="md">
                  Contact Development Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
