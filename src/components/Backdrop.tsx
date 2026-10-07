"use client";

import { useEffect, useState } from "react";

// Fixed coordinates avoid hydration differences and keep the network sparse.
const clusters = [
  [[90, 110], [158, 155], [225, 118], [180, 232]],
  [[820, 90], [890, 146], [955, 106], [998, 202]],
  [[1145, 325], [1230, 365], [1300, 290], [1330, 420]],
  [[62, 520], [136, 570], [216, 536], [175, 664]],
  [[690, 685], [760, 735], [850, 670], [895, 780]],
  [[1100, 770], [1190, 715], [1260, 798], [1322, 720]],
] as const;

export default function Backdrop() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", update);
    update();
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <div className="backdrop-layer" aria-hidden="true" data-paused={paused}>
      <div className="backdrop-glow" />
      <svg className="particle-network" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        {clusters.map((points, index) => (
          <g className={`particle-cluster cluster-${index}`} key={index}>
            <path d={`M${points[0].join(",")} L${points[1].join(",")} L${points[2].join(",")}`} className="particle-link" />
            {points.map(([cx, cy], point) => (
              <g key={point}>
                <circle cx={cx} cy={cy} r="7" className="particle-aura" />
                <circle cx={cx} cy={cy} r={point === 0 ? 1.8 : 1.2} className="particle-dot" />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
