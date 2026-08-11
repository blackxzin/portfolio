"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/chateau_de_lastours.glb";

const SPIN_SPEED = 0.2;
const ROTOR_SPEED = 0.55;

const mouse = { x: 0, y: 0 };
const target = { x: 0, y: 0 };

export function setSceneMouse(x: number, y: number) {
  target.x = x;
  target.y = y;
}

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
  const dims = meshes.map((m) => m.maxDim).sort((a, b) => a - b);
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
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((mm) => mm.clone())
          : (mesh.material as THREE.Material).clone();
      }
    });
    return { clone: c, fit: getFit(path, c, radius) };
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

    mouse.x += (target.x - mouse.x) * 0.06;
    mouse.y += (target.y - mouse.y) * 0.06;

    const t = state.clock.elapsedTime;
    g.rotation.y = t * SPIN_SPEED + mouse.x * 0.35;
    g.rotation.x = Math.sin(t * 0.35) * 0.06 + mouse.y * 0.18;
    g.position.x = mouse.x * 0.5;
    g.position.y = baseY.current + Math.sin(t * 0.8) * 0.25;

    for (const r of rotors) r.rotation.y += delta * ROTOR_SPEED;
  });

  return (
    <group ref={group} position={[0, baseY.current, 0]} scale={fit.scale}>
      <primitive object={clone} position={[-fit.center.x, -fit.center.y, -fit.center.z]} />
    </group>
  );
}

export default function Scene3D({ intro = false }: { intro?: boolean }) {
  const radius = intro ? 6.6 : 5.8;

  return (
    <Canvas
      camera={{ position: [8.5, 3.4, 8.5], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      onPointerMove={(e) => setSceneMouse((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 10, 6]} intensity={1.4} />
      <directionalLight position={[-8, -4, -6]} intensity={0.4} color="#7c3aed" />
      <pointLight position={[0, 6, 0]} intensity={0.6} color="#a78bfa" />

      <Suspense
        fallback={
          <Html center>
            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-xs font-semibold text-[#a78bfa] backdrop-blur-sm">
              Carregando modelo 3D…
            </div>
          </Html>
        }
      >
        <Model path={MODEL_PATH} radius={radius} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={intro ? 1.2 : 1.6}
        rotateSpeed={0.55}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.72}
      />
      <ContactShadows position={[0, -1.85, 0]} opacity={0.5} scale={9} blur={2.4} far={3} />
      <Environment preset="city" />
    </Canvas>
  );
}
