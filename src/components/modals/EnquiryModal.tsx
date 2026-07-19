import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { useUiStore } from "@/store/useUiStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCreateEnquiry } from "@/api/enquiries";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Field } from "@/components/ui/Input";

export function EnquiryModal() {
  const { enquiry, closeEnquiry } = useUiStore();
  const { user } = useAuthStore();
  const createMutation = useCreateEnquiry();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Prefill details for logged in users
  useEffect(() => {
    if (enquiry.open) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhone(user?.phone || "");
      setMessage(
        enquiry.projectTitle
          ? `Hi Hextorq, I am interested in the project: "${enquiry.projectTitle}". Can you please share the details regarding documentation, setup, and deliverables?`
          : "Hi Hextorq, I'd like to get in touch to discuss custom project development."
      );
    }
  }, [enquiry.open, user]);

  if (!enquiry.open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !message) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    createMutation.mutate(
      {
        name,
        email,
        phone: phone || undefined,
        message,
        projectId: enquiry.projectId,
      },
      {
        onSuccess: () => {
          closeEnquiry();
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to submit enquiry. Please try again.");
        },
      }
    );
  };

  const isPending = createMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/85 backdrop-blur-md"
        onClick={() => !isPending && closeEnquiry()}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl glow-violet md:p-8 z-10">
        <button
          onClick={closeEnquiry}
          disabled={isPending}
          className="absolute top-4 right-4 text-muted hover:text-fg disabled:opacity-50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan/10 border border-cyan/20 mb-3 text-cyan">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
            Enquire Now
          </h2>
          {enquiry.projectTitle ? (
            <p className="text-sm text-muted mt-1.5 line-clamp-1">
              Interested in: <span className="text-cyan font-medium">{enquiry.projectTitle}</span>
            </p>
          ) : (
            <p className="text-sm text-muted mt-1">
              Connect with Hextorq engineers for project requirements
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Your Name" htmlFor="enq-name">
              <Input
                id="enq-name"
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </Field>
            <Field label="Email Address" htmlFor="enq-email">
              <Input
                id="enq-email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </Field>
          </div>

          <Field label="WhatsApp / Phone Number" htmlFor="enq-phone" hint="With country code (e.g. 91XXXXXXXXXX)">
            <Input
              id="enq-phone"
              type="tel"
              placeholder="WhatsApp Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <Field label="Enquiry Message" htmlFor="enq-msg">
            <Textarea
              id="enq-msg"
              placeholder="Describe what help you need..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <div className="flex flex-col gap-3 pt-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                "Saving enquiry..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Enquiry
                </>
              )}
            </Button>
            <p className="text-[11px] text-center text-faint">
              Your details will be shared with our team. We'll respond within 24 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
