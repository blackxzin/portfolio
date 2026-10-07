"use client";

import { useEffect, useRef, useState } from "react";

/** CSS 3D works without WebGL or model downloads. */
export default function CyberCore() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); })
      : null;
    if (root.current) observer?.observe(root.current);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  return (
    <div ref={root} className="cyber-panel" data-paused={paused || !visible}>
      <div className="panel-toolbar"><span><i /><i /><i /></span><span>blackxzin / workspace</span><span aria-hidden="true">⌘</span></div>
      <div className="core-scene" aria-hidden="true">
        <span className="scene-label">CORE / 001</span>
        <div className="core-halo" />
        <div className="core-perspective">
          <div className="core-orbit orbit-one" /><div className="core-orbit orbit-two" />
          <div className="core-cube">
            {["front", "back", "right", "left", "top", "bottom"].map((face, i) => <div key={face} className={`cube-face face-${face}`}><span>{i % 2 ? "{ }" : "</>"}</span></div>)}
          </div>
        </div>
        <div className="scene-cross cross-left">+</div><div className="scene-cross cross-right">+</div>
        <span className="scene-caption">CÓDIGO EM CONSTANTE EVOLUÇÃO</span>
      </div>
      <div className="core-terminal">
        <p><span className="terminal-prompt">❯</span> cat developer.json</p>
        <p><span className="terminal-key">"foco"</span>: <span>"construir, entender, evoluir"</span></p>
        <p><span className="terminal-key">"ambiente"</span>: <span>"Linux + café + terminal"</span></p>
        <p><span className="terminal-prompt">❯</span> <span className="caret" /></p>
      </div>
      <div className="panel-bottom"><span>VISUALIZAÇÃO 3D / CSS</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Retomar animação" : "Pausar animação"}</button></div>
    </div>
  );
}
