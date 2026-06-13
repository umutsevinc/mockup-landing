"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const MODEL_URL =
  "https://slfsatozvrdsbozzqgcx.supabase.co/storage/v1/object/public/device-models/iPhone17Pro/iphone17pro.glb";
const VIDEO_URL = "/hero-showreel.mp4";

/* ════════════════════════════════════════════════════════════════════
   SCREEN TEXTURE — tries video first, falls back to animated CanvasTexture
   ════════════════════════════════════════════════════════════════════ */
function useScreenTexture() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [mode, setMode] = useState<"loading" | "video" | "fallback">("loading");
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackTexRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";

    const cleanupVideo = () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      video.pause();
      video.src = "";
      video.load();
    };

    const onCanPlay = () => {
      if (cancelled) return;
      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      tex.center.set(0.5, 0.5);
      setTexture(tex);
      setMode("video");
      video.play().catch(() => {});
    };

    const onError = () => {
      if (cancelled) return;
      cleanupVideo();
      // Build animated CanvasTexture fallback
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 2340;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawFallback(ctx, canvas.width, canvas.height, 0);
      const ctex = new THREE.CanvasTexture(canvas);
      ctex.colorSpace = THREE.SRGBColorSpace;
      ctex.flipY = false;
      ctex.center.set(0.5, 0.5);
      fallbackCanvasRef.current = canvas;
      fallbackTexRef.current = ctex;
      setTexture(ctex);
      setMode("fallback");
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    video.src = VIDEO_URL;
    video.load();

    return () => {
      cancelled = true;
      cleanupVideo();
      texture?.dispose?.();
      fallbackTexRef.current?.dispose?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { texture, mode, fallbackCanvas: fallbackCanvasRef, fallbackTex: fallbackTexRef };
}

function drawFallback(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Base
  ctx.fillStyle = "#050507";
  ctx.fillRect(0, 0, w, h);

  // Animated gradient brand (purple ⇆ teal pulse)
  const phase = (Math.sin(t * 0.0009) + 1) / 2; // 0..1, ~7s period
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, `rgba(139, 92, 246, ${0.22 + phase * 0.18})`);
  gradient.addColorStop(0.5, `rgba(40, 25, 90, 0.30)`);
  gradient.addColorStop(1, `rgba(6, 182, 212, ${0.22 + (1 - phase) * 0.18})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Subtle grid pattern (ASCII-style dots)
  ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
  for (let x = 70; x < w; x += 90) {
    for (let y = 70; y < h; y += 90) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Diagonal sweep highlight (subtle scanline that crosses)
  const sweepY = (((t * 0.05) % (h + 200)) - 100) | 0;
  const sweep = ctx.createLinearGradient(0, sweepY - 80, 0, sweepY + 80);
  sweep.addColorStop(0, "rgba(255, 255, 255, 0)");
  sweep.addColorStop(0.5, "rgba(255, 255, 255, 0.04)");
  sweep.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sweep;
  ctx.fillRect(0, sweepY - 80, w, 160);

  // Text — SHOWREEL
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "rgba(250, 250, 250, 0.78)";
  ctx.font = "500 90px ui-monospace, 'JetBrains Mono', SF Mono, Menlo, monospace";
  ctx.fillText("SHOWREEL", w / 2, h / 2 - 70);

  ctx.fillStyle = "rgba(250, 250, 250, 0.40)";
  ctx.font = "500 46px ui-monospace, 'JetBrains Mono', SF Mono, Menlo, monospace";
  ctx.fillText("·  COMING SOON  ·", w / 2, h / 2 + 60);

  // Footer mark
  ctx.fillStyle = "rgba(250, 250, 250, 0.22)";
  ctx.font = "400 32px ui-monospace, 'JetBrains Mono', SF Mono, Menlo, monospace";
  ctx.fillText("MEMSELON  MOCKUP", w / 2, h - 110);
}

/* ════════════════════════════════════════════════════════════════════
   PHONE — applies texture to screen mesh, cursor follow + idle float
   ════════════════════════════════════════════════════════════════════ */
function Phone({
  screenTex,
  mouseRef,
}: {
  screenTex: THREE.Texture | null;
  mouseRef: React.RefObject<{ x: number; y: number; active: boolean }>;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);

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
        if (Array.isArray(child.material)) {
          child.material = child.material.map(() => mat);
        } else {
          child.material = mat;
        }
        child.material.needsUpdate = true;
      }
    });
  }, [scene, screenTex]);

  useFrame((_, delta) => {
    if (!group.current) return;
    time.current += delta;

    // Cursor follow auto-active — max ~12° (Y) and ~6° (X)
    const targetY = mouseRef.current.active ? mouseRef.current.x * 0.21 : 0;
    const targetX = mouseRef.current.active ? -mouseRef.current.y * 0.10 : 0;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.045);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.045);

    // Idle float — subtle breathing
    group.current.position.y = -0.2 + Math.sin(time.current * 0.7) * 0.045;
  });

  return (
    <group ref={group} scale={2} position={[0, -0.2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FALLBACK ANIMATOR — drives CanvasTexture redraw at ~30 FPS via raf
   Lives inside Canvas to call invalidate() in frameloop="demand" mode.
   ════════════════════════════════════════════════════════════════════ */
function FallbackAnimator({
  canvas,
  tex,
  active,
}: {
  canvas: React.RefObject<HTMLCanvasElement | null>;
  tex: React.RefObject<THREE.CanvasTexture | null>;
  active: boolean;
}) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      // Throttle to ~30 FPS
      if (t - last >= 33) {
        const c = canvas.current;
        const ctex = tex.current;
        if (c && ctex) {
          const ctx = c.getContext("2d");
          if (ctx) drawFallback(ctx, c.width, c.height, t);
          ctex.needsUpdate = true;
          invalidate();
        }
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, canvas, tex, invalidate]);
  return null;
}

/* ════════════════════════════════════════════════════════════════════
   VIDEO ANIMATOR — invalidates each frame while video texture renders
   ════════════════════════════════════════════════════════════════════ */
function VideoAnimator({ active }: { active: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      invalidate();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, invalidate]);
  return null;
}

/* ════════════════════════════════════════════════════════════════════
   LOADER
   ════════════════════════════════════════════════════════════════════ */
function Loader() {
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            border: "2px solid rgba(255,255,255,0.06)",
            borderTopColor: "rgba(139,92,246,0.5)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ fontSize: 11, color: "rgba(250,250,250,0.32)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "ui-monospace, monospace" }}>
          Loading scene
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════ */
export default function HeroDevice() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [dpr, setDpr] = useState<number>(() =>
    typeof window !== "undefined" && window.innerWidth > 768 ? 1.5 : 1
  );

  const { texture, mode, fallbackCanvas, fallbackTex } = useScreenTexture();

  const handleMove = (e: React.MouseEvent) => {
    const c = containerRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    mouseRef.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    mouseRef.current.active = true;
  };
  const handleLeave = () => {
    mouseRef.current.active = false;
    // Smoothly let it return to idle (lerp continues to target=0)
  };

  // Memoize floating cards so they don't re-render on mouse move
  const floatingCards = useMemo(
    () => [
      { label: "60 FPS", dot: true, top: "10%", left: 8, delay: 0 },
      { label: "4K capture", dot: false, top: "46%", right: 8, delay: 0.6 },
      { label: "Live in Framer", dot: false, bottom: "16%", left: "22%", delay: 1.2 },
    ],
    []
  );

  return (
    <div
      className="hero-playground"
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        boxShadow:
          "0 0 80px rgba(139, 92, 246, 0.18), 0 0 160px rgba(6, 182, 212, 0.10)",
      }}
    >
      {/* Floating UI cards (HTML, not R3F) */}
      {floatingCards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1 + c.delay },
            y: {
              duration: 4 + i * 0.4,
              delay: 1 + c.delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            zIndex: 10,
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
            padding: "6px 12px",
            borderRadius: 9999,
            background: "rgba(18, 18, 26, 0.72)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            color: "rgba(250, 250, 250, 0.78)",
            fontSize: 11,
            fontWeight: 500,
            fontFamily: "ui-monospace, 'JetBrains Mono', SF Mono, Menlo, monospace",
            letterSpacing: "0.06em",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {c.dot && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
          )}
          {c.label}
        </motion.div>
      ))}
      <style>{`@keyframes pulse-dot { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 35 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        frameloop="demand"
      >
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(2, d + 0.25))}
        />

        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} intensity={0.85} />
        <directionalLight position={[-3, 2, -3]} intensity={0.35} color="#8B5CF6" />
        <directionalLight position={[3, -2, 2]} intensity={0.25} color="#06B6D4" />

        <Suspense fallback={<Loader />}>
          <Phone screenTex={texture} mouseRef={mouseRef} />
          <Environment preset="city" />
        </Suspense>

        {mode === "video" && <VideoAnimator active={true} />}
        {mode === "fallback" && (
          <FallbackAnimator
            canvas={fallbackCanvas}
            tex={fallbackTex}
            active={true}
          />
        )}
      </Canvas>
    </div>
  );
}
