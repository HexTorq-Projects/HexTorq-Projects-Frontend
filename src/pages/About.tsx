import { CheckCircle2, Shield, Code2, Users, FileText, Settings, HelpCircle, Award, TrendingUp, GraduationCap, Lock, Clock, BookOpen, MonitorPlay, MessageSquare, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { BorderGlow } from "@/components/ui/BorderGlow";

export default function About() {
  const steps = [
    {
      icon: <Code2 className="h-6 w-6 text-violet" />,
      title: "1. Select & Customize",
      desc: "Choose from 3,800+ ready projects or discuss custom requirements with Hextorq architects.",
    },
    {
      icon: <FileText className="h-6 w-6 text-cyan" />,
      title: "2. Full Handoff",
      desc: "Receive clean commented codebase, project architecture documentation, and module explanations.",
    },
    {
      icon: <Settings className="h-6 w-6 text-emerald-400" />,
      title: "3. Installation & Setup",
      desc: "Get remote setup support to run the project locally on your system with zero environment hassle.",
    },
    {
      icon: <Users className="h-6 w-6 text-amber-400" />,
      title: "4. Viva Preparation",
      desc: "Learn how the code flows, key design patterns, and get ready to answer college viva questions.",
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: "Higher, defendable scores",
      desc: "A working demo plus SRS, ER and DFD documentation gives evaluators everything they reward — and nothing to doubt.",
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-violet" />,
      title: "You genuinely learn it",
      desc: "We walk you through the architecture and data flow so you can answer any viva question in your own words.",
    },
    {
      icon: <Lock className="h-5 w-5 text-cyan" />,
      title: "Unique & plagiarism-safe",
      desc: "Each build is tailored to your requirements, so your submission never collides with a classmate's copy.",
    },
    {
      icon: <Award className="h-5 w-5 text-amber-400" />,
      title: "Placement-ready portfolio",
      desc: "Industry-grade stacks and clean, commented code turn your project into a real talking point in interviews.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      title: "Tested before handoff",
      desc: "Every module is verified to run end-to-end, so there are no surprises during your live demonstration.",
    },
    {
      icon: <Clock className="h-5 w-5 text-rose-400" />,
      title: "Weeks of time saved",
      desc: "Skip the dead-ends and environment headaches — start from a running project and invest your time in understanding it.",
    },
  ];

  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-16 aurora grain">
      {/* Hero Section */}
      <Reveal delay={0.1}>
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-fg leading-snug">
            Academic Engineering, <span className="text-gradient">Redefined.</span>
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed font-sans">
            Hextorq is an elite computer science academy and development lab bridging the gap between college curricula and high-performance industry practices. We design, build, and teach production-grade software projects to help final-year students stand out during their university defenses.
          </p>
        </section>
      </Reveal>

      {/* Trust Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Reveal delay={0.1} className="h-full">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="#f43f5e"
            backgroundColor="var(--color-surface)"
            borderRadius={20}
            glowRadius={40}
            glowIntensity={0.8}
            coneSpread={25}
            colors={['#f43f5e', '#fb7185', '#38bdf8']}
            className="h-full group"
          >
            <div className="glass p-6 rounded-2xl border border-line flex gap-4 h-full hover:border-violet/30 hover:-translate-y-0.5 transition-all">
              <Shield className="h-8 w-8 text-rose-400 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-fg text-lg">Elite Quality Assurance</h3>
                <p className="text-sm text-muted">
                  Every codebase undergoes rigorous automated and manual validation. We build stable systems that actually run, compile, and scale.
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
            colors={['#06b6d4', '#22d3ee', '#a855f7']}
            className="h-full group"
          >
            <div className="glass p-6 rounded-2xl border border-line flex gap-4 h-full hover:border-violet/30 hover:-translate-y-0.5 transition-all">
              <Code2 className="h-8 w-8 text-cyan shrink-0" />
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-fg text-lg">Cutting-Edge Tech Stacks</h3>
                <p className="text-sm text-muted">
                  No outdated curricula. We build with React, Next.js, Python AI/ML, Rust Smart Contracts, and PostgreSQL to ensure your portfolio is competitive.
                </p>
              </div>
            </div>
          </BorderGlow>
        </Reveal>
        <Reveal delay={0.3} className="h-full">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="#a855f7"
            backgroundColor="var(--color-surface)"
            borderRadius={20}
            glowRadius={40}
            glowIntensity={0.8}
            coneSpread={25}
            colors={['#a855f7', '#c084fc', '#38bdf8']}
            className="h-full group"
          >
            <div className="glass p-6 rounded-2xl border border-line flex gap-4 h-full hover:border-violet/30 hover:-translate-y-0.5 transition-all">
              <Users className="h-8 w-8 text-violet shrink-0" />
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-fg text-lg">1:1 Engineering Access</h3>
                <p className="text-sm text-muted">
                  Direct Slack and WhatsApp communication channel with the senior developers who designed your system, ensuring zero environment setup friction.
                </p>
              </div>
            </div>
          </BorderGlow>
        </Reveal>
      </section>

      {/* Why final-year projects matter */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/5 px-3 py-1 text-xs font-semibold text-violet-txt">
              <GraduationCap className="h-3.5 w-3.5" />
              Why It Matters
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight leading-tight">
              Your final-year project is the single biggest score on your degree.
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Unlike a written exam, your final-year project is judged on what you can build, explain, and defend
              in front of a panel. A polished, working system with clean documentation doesn't just earn top marks —
              it becomes the strongest talking point in your placement interviews. We make sure the project is
              genuinely <span className="text-fg font-medium">yours</span>: understood end to end, not merely submitted.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Every build follows real engineering practices — modular code, proper database design, and a clear
              architecture — so your work stands up to the toughest review and reflects industry standards instead
              of last-minute shortcuts.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="grid gap-3.5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-3.5 items-start glass border border-line rounded-2xl p-4 transition-all duration-300 hover:border-violet/30 hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-line">
                  {b.icon}
                </span>
                <div className="space-y-0.5">
                  <h3 className="font-display font-semibold text-fg text-sm">{b.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Our Teaching & Mentorship Pedagogy */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-xs font-semibold text-cyan">
            <GraduationCap className="h-3.5 w-3.5" />
            Our Teaching Pedagogy
          </div>
          <h2 className="text-3xl font-bold font-display text-fg tracking-tight">
            How We Teach: <span className="text-gradient">From Code to Confidence</span>
          </h2>
          <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed font-sans">
            We don't just hand over a zip file. Our mission is to transform you from a spectator into the builder, giving you the theoretical depth and practical clarity needed to stand tall in front of any review panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Reveal delay={0.05} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#a855f7"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#a855f7', '#c084fc', '#38bdf8']}
              className="h-full group"
            >
              <div className="glass p-6 rounded-2xl border border-line flex flex-col justify-between h-full hover:border-violet/40 hover:-translate-y-0.5 transition-all">
                <div className="space-y-3">
                  <div className="p-3 bg-surface rounded-xl inline-block border border-line">
                    <Terminal className="h-6 w-6 text-violet" />
                  </div>
                  <h3 className="font-display font-semibold text-fg text-base">Line-by-Line Code Walkthroughs</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Our engineers conduct screen-sharing sessions explaining every controller, database query, and algorithm. You will understand exactly how every line fits together.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#06b6d4"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#06b6d4', '#22d3ee', '#a855f7']}
              className="h-full group"
            >
              <div className="glass p-6 rounded-2xl border border-line flex flex-col justify-between h-full hover:border-violet/40 hover:-translate-y-0.5 transition-all">
                <div className="space-y-3">
                  <div className="p-3 bg-surface rounded-xl inline-block border border-line">
                    <BookOpen className="h-6 w-6 text-cyan" />
                  </div>
                  <h3 className="font-display font-semibold text-fg text-base">Architecture & Diagram Mastery</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Learn to explain system requirements, ER diagrams, and data flows. We teach you the high-level architecture so you can present like a system architect.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>

          <Reveal delay={0.15} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#34d399"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#34d399', '#6ee7b7', '#a855f7']}
              className="h-full group"
            >
              <div className="glass p-6 rounded-2xl border border-line flex flex-col justify-between h-full hover:border-violet/40 hover:-translate-y-0.5 transition-all">
                <div className="space-y-3">
                  <div className="p-3 bg-surface rounded-xl inline-block border border-line">
                    <MonitorPlay className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-semibold text-fg text-base">Mock Viva Defense Panels</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    We put you through mock evaluation rounds, grilling you with common review questions. You'll learn how to handle critical panel objections with technical depth.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>

          <Reveal delay={0.2} className="h-full">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#fbbf24"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={['#fbbf24', '#fcd34d', '#38bdf8']}
              className="h-full group"
            >
              <div className="glass p-6 rounded-2xl border border-line flex flex-col justify-between h-full hover:border-violet/40 hover:-translate-y-0.5 transition-all">
                <div className="space-y-3">
                  <div className="p-3 bg-surface rounded-xl inline-block border border-line">
                    <MessageSquare className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="font-display font-semibold text-fg text-base">Direct Engineer Hotlines</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Stuck during a presentation preparation or database compilation? Reach our developers directly on WhatsApp for immediate support and doubt resolution.
                  </p>
                </div>
              </div>
            </BorderGlow>
          </Reveal>
        </div>
      </section>

      {/* Assurance stats band */}
      <Reveal delay={0.1}>
        <section className="glass border border-line rounded-3xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-display text-3xl md:text-4xl font-bold text-gradient">3,800+</div>
            <div className="text-xs text-muted">Ready Projects</div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-3xl md:text-4xl font-bold text-gradient">14</div>
            <div className="text-xs text-muted">Engineering Streams</div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-3xl md:text-4xl font-bold text-gradient">100%</div>
            <div className="text-xs text-muted">Source Code Handoff</div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-3xl md:text-4xl font-bold text-gradient">1:1</div>
            <div className="text-xs text-muted">Engineer Guidance</div>
          </div>
        </section>
      </Reveal>

      {/* The Hextorq Process */}
      <section className="space-y-8 bg-surface/30 p-8 md:p-12 rounded-3xl border border-line">
        <Reveal delay={0.1} className="text-center max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight">
              How We Work with Students
            </h2>
            <p className="text-sm text-muted mt-2">
              From picking a category to final execution, we guide you at every step of your project timeline.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <Reveal key={idx} delay={idx * 0.08} className="h-full">
              <BorderGlow
                edgeSensitivity={30}
                glowColor="#a855f7"
                backgroundColor="var(--color-surface)"
                borderRadius={20}
                glowRadius={40}
                glowIntensity={0.8}
                coneSpread={25}
                colors={['#a855f7', '#c084fc', '#38bdf8']}
                className="h-full group"
              >
                <div className="space-y-3 bg-bg-soft/50 border border-line/45 p-5 rounded-2xl relative overflow-hidden hover:border-violet/30 transition-all h-full">
                  <div className="p-3 bg-surface rounded-xl inline-block border border-line/80">
                    {s.icon}
                  </div>
                  <h3 className="font-display font-semibold text-fg text-base pt-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </BorderGlow>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto space-y-8">
        <Reveal delay={0.1}>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight text-center">
            Frequently Asked Questions
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal delay={0.15}>
            <div className="space-y-2">
              <h4 className="font-display font-medium text-fg flex items-start gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-violet shrink-0 mt-1" />
                <span>Are these projects pre-built or custom?</span>
              </h4>
              <p className="text-xs text-muted leading-relaxed pl-6.5">
                We have a vast library of 3,800+ cataloged projects that are ready to ship. However, we also develop custom architectures from scratch based on your specific college guidelines or diagrams.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-2">
              <h4 className="font-display font-medium text-fg flex items-start gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-violet shrink-0 mt-1" />
                <span>Will you help me install it on my laptop?</span>
              </h4>
              <p className="text-xs text-muted leading-relaxed pl-6.5">
                Yes, absolutely! Every project includes remote environment setup assistance. We install databases, configure environment keys, and run the server and client components on your local system.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="space-y-2">
              <h4 className="font-display font-medium text-fg flex items-start gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-violet shrink-0 mt-1" />
                <span>Do you provide documentation?</span>
              </h4>
              <p className="text-xs text-muted leading-relaxed pl-6.5">
                Yes. We provide standard project reports that cover system requirements specifications (SRS), Entity Relationship (ER) diagrams, data flow diagrams (DFD), screenshots, and installation guides.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="space-y-2">
              <h4 className="font-display font-medium text-fg flex items-start gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-violet shrink-0 mt-1" />
                <span>How does the payment model work?</span>
              </h4>
              <p className="text-xs text-muted leading-relaxed pl-6.5">
                Our model is "Enquiry now, payments later". You search the catalog, tap 'Enquire', submit details, and chat with Hextorq coordinators on WhatsApp. We discuss customization, prices, and align before any transactions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <Reveal delay={0.1}>
        <section className="text-center pt-8">
          <Link to="/explore">
            <Button variant="primary" size="lg">
              Explore 3,800+ Project Catalog
            </Button>
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
