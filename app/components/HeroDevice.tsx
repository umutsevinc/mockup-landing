"use client";

import { Suspense, useRef, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL =
  "https://slfsatozvrdsbozzqgcx.supabase.co/storage/v1/object/public/device-models/iPhone17Pro/iphone17pro.glb";

/* ── Phone model ── */
function Phone({
  screenTex,
  followMouse,
  floatOn,
  mouseRef,
}: {
  screenTex: THREE.Texture | null;
  followMouse: boolean;
  floatOn: boolean;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);

  // Apply screen texture
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "Screen" && screenTex) {
        const mat = new THREE.MeshBasicMaterial({
          map: screenTex,
          color: 0xffffff,
          toneMapped: false,
          transparent: false,
          side: THREE.FrontSide,
        });
        mat.name = "Screen_Unlit";
        if (Array.isArray(child.material)) {
          child.material = child.material.map(() => mat);
        } else {
          child.material = mat;
        }
        child.material.needsUpdate = true;
      }
    });
  }, [scene, screenTex]);

  // Follow cursor + float
  useFrame((_, delta) => {
    if (!group.current) return;
    time.current += delta;

    if (followMouse && mouseRef.current) {
      const targetY = mouseRef.current.x * 0.6;
      const targetX = -mouseRef.current.y * 0.25;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.04);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.04);
    }

    if (floatOn) {
      group.current.position.y = -0.2 + Math.sin(time.current * 0.8 * Math.PI * 2) * 0.05;
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -0.2, 0.05);
    }
  });

  return (
    <group ref={group} scale={2} position={[0, -0.2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Loader ── */
function Loader() {
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 28, height: 28,
          border: "2px solid rgba(255,255,255,0.06)",
          borderTopColor: "rgba(127,119,221,0.5)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{ fontSize: 12, color: "#48484A", letterSpacing: "0.04em" }}>Loading model...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

/* ── Icons ── */
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const RotateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);
const MouseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
  </svg>
);
const WaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c2-3 4-6 6-6s4 6 6 6 4-6 6-6" />
  </svg>
);

/* ═══ MAIN COMPONENT ═══ */
export default function HeroDevice() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const orbitRef = useRef<any>(null);

  const [screenTex, setScreenTex] = useState<THREE.Texture | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [followMouse, setFollowMouse] = useState(false);
  const [floatOn, setFloatOn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [hint, setHint] = useState(true);

  // Hide hint after 5s or first interaction
  useEffect(() => {
    const t = setTimeout(() => setHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  };

  const loadImage = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Try a smaller image (max 5MB)");
      return;
    }
    const url = URL.createObjectURL(file);
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.center.set(0.5, 0.5);
      setScreenTex(tex);
      setUploaded(true);
      setHint(false);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) loadImage(file);
  }, [loadImage]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const toggleAutoRotate = () => {
    setAutoRotate((v) => !v);
    if (!autoRotate) setFollowMouse(false);
  };

  const toggleFollow = () => {
    setFollowMouse((v) => {
      if (!v) setAutoRotate(false);
      return !v;
    });
    setHint(false);
  };

  const toggleFloat = () => setFloatOn((v) => !v);

  return (
    <div className="hero-playground" ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Drop overlay */}
      {isDragging && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 20,
          border: "2px dashed rgba(127,119,221,0.5)",
          background: "rgba(127,119,221,0.06)",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ fontSize: 16, color: "var(--accent-purple)", fontWeight: 500 }}>
            Drop your screenshot
          </div>
        </div>
      )}

      {/* Hint */}
      {hint && (
        <div style={{
          position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
          zIndex: 15, fontSize: 12, color: "var(--text-tertiary)",
          transition: "opacity 0.5s", pointerEvents: "none",
        }}>
          Try it — drag your screenshot here
        </div>
      )}

      {/* Canvas */}
      <div
        style={{ width: "100%", height: "calc(100% - 48px)" }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 35 }}
          dpr={[1, typeof window !== "undefined" && window.innerWidth > 768 ? 1.25 : 1]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#7F77DD" />
          <Suspense fallback={<Loader />}>
            <Phone
              screenTex={screenTex}
              followMouse={followMouse}
              floatOn={floatOn}
              mouseRef={mouseRef}
            />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            ref={orbitRef}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={5}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            enabled={!followMouse}
          />
        </Canvas>
      </div>

      {/* Control bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 48,
        display: "flex", alignItems: "center", gap: 8, padding: "0 12px",
        background: "rgba(5,5,9,0.8)", backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-subtle)",
        borderRadius: "0 0 20px 20px",
      }}>
        <button className="ctrl-btn" onClick={() => fileRef.current?.click()}>
          <UploadIcon />
          <span className="hidden sm:inline">{uploaded ? "Change" : "Upload"}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />

        <button className={`ctrl-btn ${autoRotate ? "active" : ""}`} onClick={toggleAutoRotate}>
          <RotateIcon />
          <span className="hidden sm:inline">Rotate</span>
        </button>

        <button className={`ctrl-btn ${followMouse ? "active" : ""}`} onClick={toggleFollow}>
          <MouseIcon />
          <span className="hidden sm:inline">Follow</span>
        </button>

        <button className={`ctrl-btn ${floatOn ? "active" : ""}`} onClick={toggleFloat}>
          <WaveIcon />
          <span className="hidden sm:inline">Float</span>
        </button>
      </div>
    </div>
  );
}
