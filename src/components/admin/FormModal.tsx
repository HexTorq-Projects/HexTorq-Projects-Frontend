import type { ReactNode } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function FormModal({ open, title, onClose, children, wide }: FormModalProps) {
  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 flex min-h-full items-center justify-center overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 w-full max-h-[88vh] flex flex-col rounded-3xl border border-line bg-[#131722]/98 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl ${
              wide ? "max-w-2xl" : "max-w-md"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between pb-3.5 border-b border-line/60 flex-shrink-0">
              <h3 className="font-display text-lg font-bold text-fg flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet animate-pulse" />
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-muted hover:text-fg transition-colors p-1.5 rounded-xl hover:bg-surface-hi cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain pr-1 space-y-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
