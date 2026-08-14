"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Malha de linhas com deslocamento feito no vertex shader.
 * Custo: 1 draw call, ~14k vértices, zero download — nada de .glb nem iframe.
 * Toda a animação roda na GPU; o JS por frame só atualiza dois uniforms.
 */

const SEGMENTS = 84;
const PLANE_SIZE = 120;
const SCROLL_LERP = 0.08;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  varying float vDepth;
  varying float vWave;

  void main() {
    vec3 p = position;
    float dist = length(p.xy);

    float wave = sin(p.x * 0.17 + uTime * 0.42) * cos(p.y * 0.14 - uTime * 0.29);
    wave += 0.45 * sin(dist * 0.31 - uTime * 0.62);

    // achata as bordas para o plano sumir no escuro em vez de cortar reto
    float falloff = smoothstep(56.0, 6.0, dist);
    p.z += wave * 2.4 * falloff * (0.7 + uScroll * 0.55);

    vWave = wave * falloff;

    vec4 viewPos = modelViewMatrix * vec4(p, 1.0);
    vDepth = -viewPos.z;
    gl_Position = projectionMatrix * viewPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uSignal;
  varying float vDepth;
  varying float vWave;

  void main() {
    float near = smoothstep(4.0, 16.0, vDepth);
    float far = 1.0 - smoothstep(26.0, 74.0, vDepth);
    float fade = near * far;

    float crest = smoothstep(0.4, 1.15, vWave);
    vec3 color = mix(uBase, uSignal, crest * 0.6);

    gl_FragColor = vec4(color, fade * 0.5);
  }
`;

// alvo de scroll compartilhado: o listener escreve, o loop de render lê
const scrollTarget = { value: 0 };

function Mesh() {
  const smoothed = useRef(0);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uBase: { value: new THREE.Color("#4a4a46") },
      uSignal: { value: new THREE.Color("#ff4d19") },
    }),
    []
  );

  useFrame((_, delta) => {
    // delta limitado: aba em segundo plano volta com salto de tempo enorme
    const step = Math.min(delta, 0.05);
    smoothed.current += (scrollTarget.value - smoothed.current) * SCROLL_LERP;

    uniforms.uTime.value += step;
    uniforms.uScroll.value = smoothed.current;

    camera.position.y = 5.2 + smoothed.current * 3.4;
    camera.position.x = Math.sin(uniforms.uTime.value * 0.06) * 1.6;
    camera.lookAt(0, 0, 0);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, SEGMENTS, SEGMENTS]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function GridWave({ paused }: { paused: boolean }) {
  useEffect(() => {
    let pending = false;

    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget.value = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      pending = false;
    };

    // coalesce: um cálculo por frame, não um por evento de scroll
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 5.2, 17], fov: 44, near: 0.1, far: 120 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      style={{ pointerEvents: "none" }}
    >
      <Mesh />
    </Canvas>
  );
}
