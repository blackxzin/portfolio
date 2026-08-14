"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Decide se vale a pena ligar o WebGL.
 * Enquanto não vale (mobile, GPU fraca, movimento reduzido, aba oculta),
 * a página fica com a grade em CSS — que custa zero.
 */

const GridWave = dynamic(() => import("./GridWave"), { ssr: false });

const MIN_VIEWPORT_WIDTH = 900;
const MIN_CORES = 4;

/** GPU de software (llvmpipe, SwiftShader) roda WebGL na CPU: pior que não ter. */
function hasCapableGPU(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return false;
    }

    // libera o contexto de teste em vez de deixá-lo ocupando slot do navegador
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function shouldEnable(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.innerWidth < MIN_VIEWPORT_WIDTH) return false;
  if ((navigator.hardwareConcurrency ?? 2) < MIN_CORES) return false;
  return hasCapableGPU();
}

export default function Backdrop() {
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // só depois do primeiro paint: o texto nunca espera pelo 3D
    const check = () => setEnabled(shouldEnable());

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(check, { timeout: 1200 });
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(check, 400);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // aba escondida não renderiza: economiza bateria e evita catch-up ao voltar
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  return (
    <div className="backdrop-layer" aria-hidden="true">
      <div className="backdrop-static" />
      {enabled ? <GridWave paused={paused} /> : null}
    </div>
  );
}
