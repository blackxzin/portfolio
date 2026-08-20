"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
const FRAME_MS = 40;
const CHARS_PER_FRAME = 0.55;

interface ScrambleProps {
  text: string;
  className?: string;
  /** Atraso antes de começar, em ms. Útil para escalonar várias linhas. */
  delay?: number;
}

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Revela o texto embaralhando caracteres, da esquerda para a direita.
 * Roda uma vez, quando o elemento entra na tela.
 */
export default function Scramble({ text, className, delay = 0 }: ScrambleProps) {
  const [output, setOutput] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let raf = 0;
    let timer = 0;
    let last = 0;

    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        frame += 1;
        const settled = Math.floor(frame * CHARS_PER_FRAME);

        if (settled >= text.length) {
          setOutput(text);
          return;
        }

        setOutput(
          text
            .split("")
            .map((char, i) => (i < settled || char === " " ? char : randomGlyph()))
            .join("")
        );
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      setOutput(text.replace(/\S/g, () => randomGlyph()));
      timer = window.setTimeout(() => {
        raf = requestAnimationFrame(tick);
      }, delay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className}>
      {output}
    </span>
  );
}
