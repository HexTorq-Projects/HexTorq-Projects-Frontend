import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Reveal } from "@/components/motion/Reveal";
import { useCreateEnquiry } from "@/api/enquiries";
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/constants";
import { AnimatedSendButton } from "@/components/ui/AnimatedSendButton";

export default function Contact() {
  const createMutation = useCreateEnquiry();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    createMutation.mutate(
      { name, email, phone: phone || undefined, message },
      {
        onSuccess: () => {
          setSuccess(true);
          setName("");
          setEmail("");
          setPhone("");
          setMessage("");
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to submit message. Please try again.");
        },
      }
    );
  };

  const isPending = createMutation.isPending;

  const infoRows = [
    {
      icon: Mail,
      color: "violet" as const,
      title: "Email support",
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: Phone,
      color: "cyan" as const,
      title: "WhatsApp Business",
      value: `+${WHATSAPP_NUMBER}`,
      href: `tel:+${WHATSAPP_NUMBER}`,
    },
  ];

  const infoStyles = {
    violet: "bg-violet/10 border-violet/20 text-violet",
    cyan: "bg-cyan/10 border-cyan/20 text-cyan",
  };

  return (
    <div className="relative overflow-hidden min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto aurora grain">
      {/* Twilight Haze soft accent glow */}
      <div className="twilight-orb w-[30rem] h-[30rem] -top-32 -left-32" aria-hidden="true" />
      <div className="twilight-orb w-[24rem] h-[24rem] bottom-0 -right-24" aria-hidden="true" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <Reveal>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold font-display tracking-tight text-fg leading-tight">
                Get in Touch
              </h1>
              <p className="text-sm text-muted">
                Have specific questions, custom project ideas, or complex college requirements? Talk directly with our senior development engineers.
              </p>
            </div>
          </Reveal>

          <div className="space-y-4">
            {infoRows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <Reveal key={row.title} delay={0.05 + idx * 0.05}>
                  <a
                    href={row.href}
                    className="group flex gap-4 items-start rounded-xl p-2 -m-2 transition-all duration-200 hover:bg-surface-hi/50 hover:translate-x-1"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 ${infoStyles[row.color]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-fg text-sm">{row.title}</h4>
                      <span className="text-sm text-muted group-hover:text-cyan transition-colors">
                        {row.value}
                      </span>
                    </div>
                  </a>
                </Reveal>
              );
            })}

            <Reveal delay={0.15}>
              <div className="group flex gap-4 items-start rounded-xl p-2 -m-2 transition-all duration-200 hover:bg-surface-hi/50 hover:translate-x-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-faint/10 border border-faint/20 text-faint shrink-0 transition-transform duration-200 group-hover:scale-110">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-fg text-sm">IT Lab Center</h4>
                  <p className="text-sm text-muted leading-relaxed">
                    Hextorq IT Labs, Outer Ring Road, Bangalore, KA, India.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Quick WhatsApp button */}
          <Reveal delay={0.2}>
            <div className="glass p-5 rounded-2xl border border-line bg-surface/40 space-y-3 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-black/5">
              <h4 className="font-display font-semibold text-fg text-base flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                Direct Support Chat
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Bypass forms and open a conversation instantly on WhatsApp with one of our project advisors.
              </p>
              <Button
                variant="outline"
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Hextorq, I want to talk about my final year project.`, "_blank")}
                className="w-full text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40"
              >
                Start WhatsApp Chat
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Contact Form Column */}
        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="glass p-6 md:p-8 rounded-2xl border border-line bg-surface/50 shadow-xl relative overflow-hidden">
            <h2 className="font-display text-2xl font-bold tracking-tight text-fg mb-1">
              Send a Message
            </h2>
            <p className="text-sm text-muted mb-6">
              Describe what you need, and we'll get back to you within 24 hours.
            </p>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-medium text-emerald-400"
                >
                  Your message was sent successfully! We'll get back to you within 24 hours.
                </motion.div>
              )}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-medium text-rose-400"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Your Name" htmlFor="contact-name">
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Full Name"
                    required
                    icon={<User className="h-4 w-4" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                  />
                </Field>
                <Field label="Email Address" htmlFor="contact-email">
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    icon={<Mail className="h-4 w-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                  />
                </Field>
              </div>

              <Field label="WhatsApp Phone Number" htmlFor="contact-phone" hint="For quick callbacks">
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="WhatsApp Number (e.g. 919999999999)"
                  icon={<Phone className="h-4 w-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isPending}
                />
              </Field>

              <Field label="Your Message / Project Requirements" htmlFor="contact-message">
                <Textarea
                  id="contact-message"
                  placeholder="List your project title, tech stack ideas, college constraints, or general queries..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isPending}
                />
              </Field>

              <AnimatedSendButton type="submit" isPending={isPending} success={success} />
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
