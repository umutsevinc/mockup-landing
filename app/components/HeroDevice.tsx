"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL =
  "https://slfsatozvrdsbozzqgcx.supabase.co/storage/v1/object/public/device-models/iPhone17Pro/iphone17pro.glb";

function Phone({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<THREE.Group>(null);

  // Smooth follow mouse
  useFrame(() => {
    if (!ref.current || !mouse.current) return;
    const targetY = mouse.current.x * 0.4;
    const targetX = -mouse.current.y * 0.15;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.05);
  });

  return (
    <group ref={ref} scale={1.8} position={[0, -0.3, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div style={{
        width: 40,
        height: 40,
        border: "2px solid rgba(255,255,255,0.1)",
        borderTopColor: "rgba(96,165,250,0.6)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Html>
  );
}

export default function HeroDevice() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full"
      style={{ cursor: "grab" }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#a78bfa" />
        <Suspense fallback={<Loader />}>
          <Phone mouse={mouse} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.3}
            scale={6}
            blur={2.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
