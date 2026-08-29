import { useEffect, useRef } from "react";
import * as THREE from "three";
import { readReduceMotion } from "@/lib/motion-preference";

type Tier = "off" | "low" | "medium" | "high";

/** Detects a rough performance tier from hardware hints + viewport size. */
function detectTier(): Tier {
  if (typeof window === "undefined") return "off";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "off";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (cores <= 2 || memory <= 2) return "low";
  if (width < 640 || (coarse && cores <= 4) || memory <= 4) return "low";
  if (width < 1280 || cores <= 6) return "medium";
  return "high";
}

const TIERS: Record<Exclude<Tier, "off">, {
  count: number;
  pixelRatio: number;
  antialias: boolean;
  wireDetail: number;
  wireOpacity: number;
  size: number;
}> = {
  low: { count: 450, pixelRatio: 1, antialias: false, wireDetail: 1, wireOpacity: 0.1, size: 0.11 },
  medium: { count: 1000, pixelRatio: 1.35, antialias: false, wireDetail: 2, wireOpacity: 0.12, size: 0.095 },
  high: { count: 1800, pixelRatio: 1.75, antialias: false, wireDetail: 2, wireOpacity: 0.12, size: 0.085 },
};

/**
 * Subtle fixed 3D particle background. Reacts smoothly to mouse movement.
 * Scales quality by device tier, pauses when hidden and respects prefers-reduced-motion.
 */
export function ParticleField() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    const reduced = readReduceMotion();
    if (reduced) return;
    const tier = detectTier();
    if (tier === "off") return;
    const cfg = TIERS[tier];

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.055);

    const camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      120,
    );
    camera.position.z = 22;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: cfg.antialias,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.pixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // --- particles ---
    const count = cfg.count;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
      scales[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const mat = new THREE.PointsMaterial({
      size: cfg.size,
      sizeAttenuation: true,
      color: new THREE.Color("#6d7dff"),
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // --- wireframe mesh ---
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(11, cfg.wireDetail)),
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#2bd6ff"),
        transparent: true,
        opacity: cfg.wireOpacity,
      }),
    );
    scene.add(wire);

    // --- interaction ---
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let visible = !document.hidden;
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Frame budget: cap FPS on weaker devices to save battery/CPU.
    const maxFps = tier === "low" ? 30 : tier === "medium" ? 45 : 60;
    const frameInterval = 1000 / maxFps;
    let lastFrame = 0;

    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      const t = (now - start) / 1000;

      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      if (!reduced) {
        points.rotation.y = t * 0.02 + current.x * 0.35;
        points.rotation.x = current.y * 0.25;
        wire.rotation.y = -t * 0.035 + current.x * 0.2;
        wire.rotation.x = t * 0.02 + current.y * 0.15;
      }
      camera.position.x += (current.x * 2.2 - camera.position.x) * 0.05;
      camera.position.y += (-current.y * 1.6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      mat.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={holder}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70 [mask-image:radial-gradient(80%_70%_at_50%_35%,#000_55%,transparent_100%)]"
    />
  );
}
