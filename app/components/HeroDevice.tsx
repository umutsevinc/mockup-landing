"use client";

import { Suspense, useRef, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL =
  "https://slfsatozvrdsbozzqgcx.supabase.co/storage/v1/object/public/device-models/iPhone17Pro/iphone17pro.glb";

/* ── Phone with screen replacement ── */
function Phone({
  mouse,
  screenTexture,
  lightIntensity,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  screenTexture: THREE.Texture | null;
  lightIntensity: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<THREE.Group>(null);

  // Apply screen texture when it changes
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "Screen") {
        if (screenTexture) {
          child.material = new THREE.MeshBasicMaterial({
            map: screenTexture,
            toneMapped: false,
          });
        }
      }
    });
  }, [scene, screenTexture]);

  // Smooth follow mouse
  useFrame(() => {
    if (!ref.current || !mouse.current) return;
    const targetY = mouse.current.x * 0.5;
    const targetX = -mouse.current.y * 0.2;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.04);
  });

  return (
    <>
      <ambientLight intensity={0.3 + lightIntensity * 0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5 + lightIntensity * 0.8} />
      <directionalLight position={[-3, 2, -2]} intensity={0.15 + lightIntensity * 0.2} color="#a78bfa" />
      <group ref={ref} scale={2} position={[0, -0.2, 0]}>
        <primitive object={scene} />
      </group>
    </>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div
          style={{
            width: 32,
            height: 32,
            border: "2px solid rgba(255,255,255,0.08)",
            borderTopColor: "rgba(96,165,250,0.5)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
          Loading 3D model...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

/* ── Main component ── */
export default function HeroDevice() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(null);
  const [lightIntensity, setLightIntensity] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  const loadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      setScreenTexture(tex);
      setHasUploaded(true);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        loadImage(file);
      }
    },
    [loadImage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadImage(file);
    },
    [loadImage]
  );

  return (
    <div className="flex flex-col h-full">
      {/* 3D viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="flex-1 relative"
        style={{ cursor: "grab" }}
      >
        {/* Drop zone overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-400/40 bg-blue-500/[0.06] backdrop-blur-sm">
            <div className="text-[13px] text-blue-400/80 font-medium">Drop your image here</div>
          </div>
        )}

        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 35 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={<Loader />}>
            <Phone mouse={mouse} screenTexture={screenTexture} lightIntensity={lightIntensity} />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.8, 0]} opacity={0.25} scale={6} blur={2.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.02] border-t border-white/[0.06] rounded-b-2xl">
        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-8 px-3.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] text-[#8b8b8d] font-medium hover:bg-white/[0.1] hover:text-white transition-all duration-200 flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {hasUploaded ? "Change" : "Add image"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        {/* Light slider */}
        <div className="flex items-center gap-2.5 flex-1 max-w-[180px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
            className="flex-1 h-1 rounded-full appearance-none bg-white/10 accent-blue-400"
            style={{ accentColor: "#60a5fa" }}
          />
        </div>

        {/* Hint */}
        <span className="text-[10px] text-[#555557] hidden sm:block">Move cursor to orbit</span>
      </div>
    </div>
  );
}
