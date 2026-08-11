"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// decoder DRACO local (modelos otimizados) — uma vez por sessão
useGLTF.setDecoderPath("/draco/");

export type SceneModel = {
  path: string;
  poster?: string;
  accent: string;
  label: string;
};

// CASTELO é o 3D principal — otimizado (DRACO + WebP): 86MB → 16MB
export const CASTLE: SceneModel = {
  path: "/models/chateau_de_lastours.glb",
  accent: "#a78bfa",
  label: "Castelo de Lastours",
};

const pointer = { x: 0, y: 0 };

export function setSceneMouse(x: number, y: number) {
  pointer.x = x;
  pointer.y = y;
}

// detecta GPU decente: mobile/software render fica apenas no poster estático
export const qualifies = (() => {
  if (typeof window === "undefined") return false;
  if (navigator.userAgent.includes("Mobile")) return false;
  if (window.devicePixelRatio >= 1.5) return true;
  let ok = false;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    ok = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) >= 4096 : false;
    if (gl && "WEBGL_debug_renderer_info" in gl) {
      const name = String(
        gl.getParameter(
          (gl as WebGLRenderingContext & { WEBGL_debug_renderer_info: { UNMASKED_RENDERER_WEBGL: number } })
            .WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL
        )
      );
      if (/swiftshader|llvmpipe|software/i.test(name)) ok = false;
    }
  } catch {
    /* no GL: leave as-is */
  }
  return ok;
})();

export function SceneFallback({ accent, label }: { accent: string; label: string }) {
  return (
    <div
      className="flex h-full w-full items-end justify-center pb-24"
      style={{
        background: `radial-gradient(circle at 50% 45%, ${accent}22, transparent 70%)`,
      }}
    >
      <div className="pointer-events-none flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-xs font-semibold text-[#f1f1f3] backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
        Carregando modelo 3D · {label}
      </div>
    </div>
  );
}

export function ScenePoster({ accent, label }: { accent: string; label: string }) {
  return (
    <div
      className="relative h-full w-full"
      style={{ background: `radial-gradient(circle at 50% 45%, ${accent}22, transparent 70%)` }}
    >
      <span className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-widest text-[#5b5c68]">
        {label}
      </span>
    </div>
  );
}

const SPIN_SPEED = 0.2;
const ROTOR_SPEED = 0.55;

// encaixa o modelo automaticamente: escala + centro + posição do chão (cache por arquivo)
const fitCache = new Map<string, { scale: number; center: THREE.Vector3; floorY: number }>();

// mede o modelo por malha, ignorando outliers gigantes (ex.: cúpula de céu) que quebrariam o fit
function measure(scene: THREE.Object3D) {
  const meshes: { verts: number; box: THREE.Box3; maxDim: number }[] = [];
  scene.updateWorldMatrix(true, false);
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry?.attributes?.position) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!;
    const box = new THREE.Box3(b.min, b.max).applyMatrix4(mesh.matrixWorld);
    const maxDim = Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
    meshes.push({ verts: mesh.geometry.attributes.position.count, box, maxDim });
  });
  if (!meshes.length) return { size: new THREE.Vector3(1, 1, 1), center: new THREE.Vector3(0, 0, 0) };

  // filtro robusto: percentil p90 das dimensões de malha — corta outliers gigantes
  // (ex.: cúpula de céu do loft, 77.2 vs interior ~6.5)
  const dims = meshes
    .map((m) => m.maxDim)
    .sort((a, b) => a - b);
  const p90 = dims[Math.min(meshes.length - 1, Math.floor(meshes.length * 0.9))];
  const keep = meshes.filter((m) => m.maxDim <= p90 * 1.5);

  const box = new THREE.Box3();
  for (const m of keep) box.union(m.box);
  return { size: box.getSize(new THREE.Vector3()), center: box.getCenter(new THREE.Vector3()) };
}

function getFit(path: string, scene: THREE.Object3D, radius: number) {
  const cached = fitCache.get(path);
  if (cached) return cached;
  const { size, center } = measure(scene);
  const scale = radius / Math.max(size.x, size.y, size.z);
  const fit = { scale, center: center.clone(), floorY: (center.y - size.y / 2) * scale };
  fitCache.set(path, fit);
  return fit;
}

function Model({ path, radius }: { path: string; radius: number }) {
  const { scene } = useGLTF(path);
  const group = useRef<THREE.Group>(null);
  const baseY = useRef(0);

  const { clone, fit } = useMemo(() => {
    const c = scene.clone(true);
    const fit = getFit(path, c, radius);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((mm) => mm.clone())
          : (mesh.material as THREE.Material).clone();
      }
    });
    return { clone: c, fit };
  }, [scene, path, radius]);

  const rotors = useMemo(() => {
    const list: THREE.Object3D[] = [];
    clone.traverse((o) => {
      if (o.name.toLowerCase().includes("wing") || /heli|rotor|blade/i.test(o.name)) list.push(o);
    });
    return list;
  }, [clone]);

  baseY.current = -1.85 - fit.floorY;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    g.rotation.y = t * SPIN_SPEED - pointer.x * 0.35;
    g.rotation.x = Math.sin(t * 0.35) * 0.06 + pointer.y * 0.12;
    g.position.x = -pointer.x * 0.5;
    g.position.y = baseY.current + Math.sin(t * 0.8) * 0.25;

    for (const r of rotors) r.rotation.y += delta * ROTOR_SPEED;
  });

  return (
    <group ref={group} position={[0, baseY.current, 0]} scale={fit.scale}>
      <primitive object={clone} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
    </group>
  );
}

export default function Scene3D({
  intro = false,
  path = CASTLE.path,
  accent = CASTLE.accent,
  label = CASTLE.label,
}: {
  intro?: boolean;
  path?: string;
  accent?: string;
  label?: string;
}) {
  const radius = intro ? 6.6 : 5.8;
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    // monta o 3D só após o primeiro paint — a página aparece instantânea
    if (qualifies) setWebgl(true);
  }, []);

  // sem webgl (mobile/software): arte estática imediata
  if (!webgl) {
    return (
      <ScenePoster
        accent={accent}
        label={label}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* poster atrás: pinta imediatamente; o canvas faz fade por cima */}
      <ScenePoster accent={accent} label={label} />
      <Canvas
        className="absolute inset-0"
        camera={{ position: [8.5, 3.4, 8.5], fov: 38 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        onCreated={(state) => {
          // fade suave depois do primeiro frame renderizado
          requestAnimationFrame(() => {
            const el = state.gl.domElement;
            el.style.transition = "opacity 700ms ease";
            el.style.opacity = "1";
          });
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[8, 10, 6]} intensity={1.4} />
        <directionalLight position={[-8, -4, -6]} intensity={0.4} color="#7c3aed" />
        <pointLight position={[0, 6, 0]} intensity={0.6} color="#a78bfa" />

        <Suspense fallback={null}>
          <Model path={path} radius={radius} />
        </Suspense>
      </Canvas>
    </div>
  );
}