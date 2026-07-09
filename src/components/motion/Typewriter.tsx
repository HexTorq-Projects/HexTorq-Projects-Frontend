import React, { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function Typewriter({
  words,
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 1800,
  className = "",
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setCurrentText(words[0]);
      return;
    }

    let timer: any;
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(currentWord.slice(0, currentText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration, reduced]);

  return (
    <span className={`${className} inline-flex items-center`}>
      {currentText}
      <span className="ml-1 inline-block w-[3px] h-[0.9em] bg-current animate-pulse shrink-0" style={{ verticalAlign: "middle" }} />
    </span>
  );
}

export default Typewriter;
