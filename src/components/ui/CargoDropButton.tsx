import React, { useRef, useEffect, useCallback } from "react";
import "./CargoDropButton.css";

export interface CargoDropButtonProps {
  onAddToCart?: () => void;
  inCart?: boolean;
  size?: "sm" | "card" | "md" | "full";
  className?: string;
  idleLabel?: string;
  doneLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function CargoDropButton({
  onAddToCart,
  inCart = false,
  size = "md",
  className = "",
  idleLabel = "Add to cart",
  doneLabel = "Added",
  disabled = false,
  type = "button",
}: CargoDropButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const liveRef = useRef<HTMLSpanElement | null>(null);
  const isPlayingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const resetAnimationClasses = useCallback(() => {
    if (btnRef.current) {
      btnRef.current.classList.remove(
        "is-playing",
        "s-enter",
        "s-scan",
        "s-fold",
        "s-ship",
        "s-done",
        "s-reset",
        "is-rm-done",
        "belt-run"
      );
    }
    isPlayingRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isPlayingRef.current) return;

    isPlayingRef.current = true;
    clearAllTimers();

    if (liveRef.current) {
      liveRef.current.textContent = "";
    }

    const btn = btnRef.current;
    if (!btn) return;

    // Trigger parent cart action
    if (onAddToCart) {
      onAddToCart();
    }

    // Check prefers-reduced-motion
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }

    if (reduced) {
      btn.classList.add("is-rm-done");
      if (liveRef.current) liveRef.current.textContent = "Added to cart";
      addTimer(() => {
        resetAnimationClasses();
      }, 1600);
      return;
    }

    /* Beat 1: belt + scanner in, carton rides to the scan point */
    btn.classList.add("is-playing", "s-enter", "belt-run");
    addTimer(() => {
      btn.classList.remove("belt-run");
    }, 1250);

    /* Beat 2: laser sweep, scan flash, green blip */
    addTimer(() => {
      btn.classList.add("s-scan");
    }, 1280);

    /* Beat 3: flaps fold, tape seals, label pops, cart rolls in */
    addTimer(() => {
      btn.classList.add("s-fold");
    }, 2000);

    /* Beat 4: belt resumes, parcel drops into the cart, bump + badge */
    addTimer(() => {
      btn.classList.add("s-ship", "belt-run");
    }, 3080);
    addTimer(() => {
      btn.classList.remove("belt-run");
    }, 3530);

    /* Beat 5: confirmation */
    addTimer(() => {
      btn.classList.add("s-done");
      if (liveRef.current) {
        liveRef.current.textContent = "Added to cart";
      }
    }, 4300);

    /* Graceful return to idle, then unlock for replay */
    addTimer(() => {
      btn.classList.add("s-reset");
    }, 5450);
    addTimer(() => {
      resetAnimationClasses();
    }, 5900);
  };

  const sizeClass =
    size === "card"
      ? "acp-wrap-card"
      : size === "sm"
      ? "acp-wrap-sm"
      : size === "full"
      ? "acp-wrap-full"
      : "";

  return (
    <div className={`acp-wrap ${sizeClass} ${className}`.trim()}>
      <button
        ref={btnRef}
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className="acp-btn"
        aria-label={inCart ? "In cart - click to add again" : idleLabel}
      >
        {/* Idle face */}
        <span className="acp-idle">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
            <path d="M4 7l8 4 8-4" />
            <path d="M12 11v10" />
          </svg>
          <span>{inCart ? "In Cart" : idleLabel}</span>
        </span>

        {/* Scene container */}
        <span className="acp-scene" aria-hidden="true">
          <span className="acp-belt">
            <span className="acp-tread" />
          </span>
          <span className="acp-scanner">
            <span className="acp-scan-mount" />
            <span className="acp-scan-head" />
            <span className="acp-scan-led" />
            <span className="acp-blink" />
          </span>
          <span className="acp-laser" />
          <span className="acp-box">
            <span className="acp-face" />
            <span className="acp-barcode" />
            <span className="acp-flap acp-flap-l" />
            <span className="acp-flap acp-flap-r" />
            <span className="acp-tape" />
            <span className="acp-slabel" />
            <span className="acp-flash" />
          </span>
          <span className="acp-cart">
            <svg width="40" height="38" viewBox="0 0 40 38" aria-hidden="true">
              <path
                d="M3 5h4.5l2.5 6"
                fill="none"
                stroke="#9aa7b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 10h28.5l-3.5 17h-20l-5-17z"
                fill="#1c232e"
                stroke="#9aa7b8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="15" cy="32.5" r="3" fill="#1c232e" stroke="#9aa7b8" strokeWidth="2" />
              <circle cx="28" cy="32.5" r="3" fill="#1c232e" stroke="#9aa7b8" strokeWidth="2" />
            </svg>
            <span className="acp-badge">+1</span>
          </span>
        </span>

        {/* Done overlay */}
        <span className="acp-done" aria-hidden="true">
          <svg className="acp-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="acp-check-ring" cx="12" cy="12" r="10" strokeWidth="1.6" />
            <path
              className="acp-check-path"
              d="M7.2 12.4l3.3 3.3 6.3-6.9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
            />
          </svg>
          <span>{doneLabel}</span>
        </span>
      </button>
      <span ref={liveRef} className="acp-live" aria-live="polite" />
    </div>
  );
}

export default CargoDropButton;
