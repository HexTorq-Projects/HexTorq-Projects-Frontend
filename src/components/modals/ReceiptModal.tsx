import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Printer, Download, Sparkles, Check, ArrowRight } from "lucide-react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "@/components/ui/ReceiptPrinter";
import { formatINR, formatDate } from "@/lib/format";
import type { Order } from "@/api/types";
import { Button } from "@/components/ui/Button";

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  initialStage?: ReceiptPrinterStage;
}

export function ReceiptModal({
  order,
  isOpen,
  onClose,
  initialStage = "printing",
}: ReceiptModalProps) {
  const [stage, setStage] = useState<ReceiptPrinterStage>(initialStage);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStage(initialStage);
      if (initialStage === "processing") {
        const t1 = setTimeout(() => setStage("printing"), 1200);
        const t2 = setTimeout(() => setStage("complete"), 3600);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      } else if (initialStage === "printing") {
        const t = setTimeout(() => setStage("complete"), 2400);
        return () => clearTimeout(t);
      }
    }
  }, [isOpen, initialStage]);

  if (!isOpen || !order) return null;

  const paidAmount =
    order.paymentStatus === "SUCCESS"
      ? order.totalAmount
      : order.status === "BOOKED" && order.balanceDue > 0
      ? order.totalAmount - order.balanceDue
      : order.totalAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    if (order.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-md my-8 flex flex-col items-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Receipt Printer Component */}
          <ReceiptPrinter.Root stage={stage} feedMotion="stepped">
            <ReceiptPrinter.Machine>
              <ReceiptPrinter.Header>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-violet to-cyan flex items-center justify-center shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-display text-sm font-black tracking-wider text-white">
                    HEXTORQ
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyId}
                    className="text-[11px] font-mono font-bold text-cyan bg-cyan/10 border border-cyan/25 hover:bg-cyan/20 px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                    title="Click to copy Order #"
                  >
                    {copied ? <Check className="h-3 w-3" /> : null}
                    <span>{order.orderNumber}</span>
                  </button>
                </div>
              </ReceiptPrinter.Header>

              <ReceiptPrinter.Screen>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white/90">
                        {order.items.length === 1
                          ? order.items[0].projectTitleSnapshot
                          : `${order.items.length} Project Package(s)`}
                      </p>
                      <p className="text-[10px] text-white/50 pt-0.5">
                        Verified Pay-Panda Handoff
                      </p>
                    </div>
                    <strong className="font-mono text-base font-black text-emerald-400">
                      {formatINR(order.totalAmount)}
                    </strong>
                  </div>
                  <ReceiptPrinter.Status />
                </div>
              </ReceiptPrinter.Screen>
            </ReceiptPrinter.Machine>

            <ReceiptPrinter.Output>
              <ReceiptPrinter.Paper>
                {/* Receipt Paper Content */}
                <div className="space-y-4 text-xs font-mono select-text">
                  {/* Store Header */}
                  <div className="text-center pb-3 border-b border-dashed border-black/30 space-y-1">
                    <h3 className="font-extrabold text-sm tracking-widest uppercase">
                      HEXTORQ LABS
                    </h3>
                    <p className="text-[10px] text-black/60">
                      Final Year Project Verification
                    </p>
                    <p className="text-[10px] text-black/50">
                      {formatDate(order.rowCreatedTime)}
                    </p>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-black/60">ORDER #:</span>
                      <span className="font-bold">{order.orderNumber}</span>
                    </div>
                    {order.customerName && (
                      <div className="flex justify-between">
                        <span className="text-black/60">STUDENT:</span>
                        <span className="font-semibold truncate max-w-[170px]">
                          {order.customerName}
                        </span>
                      </div>
                    )}
                    {order.customerEmail && (
                      <div className="flex justify-between">
                        <span className="text-black/60">EMAIL:</span>
                        <span className="font-mono truncate max-w-[170px]">
                          {order.customerEmail}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Itemized list */}
                  <div className="pt-2 border-t border-dashed border-black/30 space-y-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-black/50 block">
                      PURCHASED PACKAGES
                    </span>
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-start justify-between gap-2 text-[11px]"
                      >
                        <span className="font-medium line-clamp-2">
                          {idx + 1}. {item.projectTitleSnapshot}
                        </span>
                        <span className="font-bold shrink-0">
                          {formatINR(item.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals & Breakdown */}
                  <div className="pt-2 border-t border-dashed border-black/30 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-black/70">
                      <span>SUBTOTAL</span>
                      <span>{formatINR(order.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-black/70">
                      <span>SETUP & SUPPORT</span>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-black/20">
                      <span>TOTAL PAID</span>
                      <span className="text-emerald-800">{formatINR(paidAmount)}</span>
                    </div>
                    {order.status === "BOOKED" && order.balanceDue > 0 && (
                      <div className="flex justify-between text-amber-800 font-semibold text-[10px]">
                        <span>BALANCE DUE LATER:</span>
                        <span>{formatINR(order.balanceDue)}</span>
                      </div>
                    )}
                  </div>

                  {/* Barcode representation */}
                  <div className="pt-3 border-t border-dashed border-black/30 text-center space-y-1.5">
                    <div className="h-9 w-full flex items-center justify-center gap-[3px] overflow-hidden px-4 opacity-80">
                      {Array.from({ length: 34 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-full bg-black"
                          style={{
                            width: i % 4 === 0 ? "3px" : i % 2 === 0 ? "1px" : "2px",
                            opacity: i % 7 === 0 ? 0.4 : 1,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] font-mono tracking-widest text-black/60 uppercase">
                      AUTH CODE: {order.id.slice(0, 16).toUpperCase()}
                    </p>
                  </div>

                  {/* Footer message */}
                  <div className="text-center pt-2 text-[10px] text-black/60">
                    <p className="font-semibold">THANK YOU FOR YOUR ORDER!</p>
                    <p className="text-[9px]">Keep this receipt for code handoff & viva support.</p>
                  </div>
                </div>
              </ReceiptPrinter.Paper>
            </ReceiptPrinter.Output>
          </ReceiptPrinter.Root>

          {/* Quick Actions after complete */}
          <div className="w-full max-w-sm mt-4 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex-1 h-10 rounded-xl bg-surface/90 border-line text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-violet/40"
            >
              <Printer className="h-3.5 w-3.5 text-cyan" />
              <span>Print Receipt</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Done</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ReceiptModal;
