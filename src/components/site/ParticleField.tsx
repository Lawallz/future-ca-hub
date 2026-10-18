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

const TIERS: Record<
  Exclude<Tier, "off">,
  {
    count: number;
    pixelRatio: number;
    antialias: boolean;
    wireDetail: number;
    wireOpacity: number;
    size: number;
    sphereSegments: number;
    orbits: number;
    comets: number;
  }
> = {
  low: { count: 450, pixelRatio: 1, antialias: false, wireDetail: 1, wireOpacity: 0.16, size: 0.11, sphereSegments: 24, orbits: 1, comets: 0 },
  medium: { count: 1000, pixelRatio: 1.35, antialias: false, wireDetail: 2, wireOpacity: 0.18, size: 0.095, sphereSegments: 36, orbits: 2, comets: 1 },
  high: { count: 1800, pixelRatio: 1.75, antialias: true, wireDetail: 2, wireOpacity: 0.2, size: 0.085, sphereSegments: 56, orbits: 3, comets: 2 },
};

/* Paleta do CA-ADS: roxo + verde */
const ROXO = "#a855f7";
const ROXO_PROFUNDO = "#7c3aed";
const VERDE = "#4ade80";
const FUNDO = 0x0b0714;

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

/** Partículas: círculos suaves com brilho, tremeluzir, deriva e repulsão do cursor. */
const PARTICLE_VERT = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform float uBurst;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float ph = aScale * 40.0;
    p.x += cos(uTime * 0.25 + ph) * 0.35;
    p.y += sin(uTime * 0.30 + ph * 1.3) * 0.45;
    p.z += sin(uTime * 0.20 + ph * 0.7) * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // Repulsão suave em torno do cursor (calculada em espaço de tela).
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uMouse;
    d.x *= uAspect;
    float dist = length(d);
    float near = smoothstep(0.4, 0.0, dist);
    vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
    dir.x /= uAspect;
    clip.xy += dir * near * 0.12 * clip.w;
    gl_Position = clip;

    float depth = max(-mv.z, 0.1);
    float tw = 0.62 + 0.38 * sin(uTime * (0.7 + aScale * 1.9) + ph);
    float fade = exp(-pow(depth * 0.042, 2.0));

    vAlpha = tw * fade * (0.5 + aScale * 0.7) * (1.0 + near * 0.9 + uBurst * 0.8);
    vColor = mix(aColor, vec3(1.0), near * 0.35);

    float size = uSize * uScale / depth * (0.55 + aScale * 1.2);
    size *= 1.0 + near * 0.9 + uBurst * 0.5;
    gl_PointSize = clamp(size, 1.0, 64.0);
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float glow = pow(1.0 - d, 2.4);
    float core = pow(1.0 - d, 8.0);
    vec3 col = vColor * glow + vec3(1.0) * core * 0.55;
    gl_FragColor = vec4(col, (glow * 0.9 + core) * vAlpha);
    #include <colorspace_fragment>
  }
`;

/** Esfera central: brilho de borda (fresnel) roxo -> verde, com faixas de varredura. */
const CORE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`;

const CORE_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  uniform vec3 uA;
  uniform vec3 uB;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  void main() {
    float f = 1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0);
    float rim = pow(f, 2.6);
    float bands = smoothstep(0.92, 1.0, sin(vPos.y * 2.2 - uTime * 0.7));
    float mixAmt = clamp(rim * 1.2 + 0.15 * sin(vPos.y * 0.4 + uTime * 0.3), 0.0, 1.0);
    vec3 col = mix(uA, uB, mixAmt);
    float a = rim * 0.65 + bands * 0.07 + 0.035 + uBurst * 0.14 * rim;
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

/** Rede wireframe com pulsos de energia viajando pelas arestas. */
const NET_VERT = /* glsl */ `
  attribute float aProg;
  attribute float aSeed;
  varying float vProg;
  varying float vSeed;

  void main() {
    vProg = aProg;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NET_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uBase;
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vProg;
  varying float vSeed;

  void main() {
    float isOn = step(0.45, fract(vSeed * 13.37));
    float speed = 0.12 + 0.1 * fract(vSeed * 7.1);
    float p = fract(uTime * speed + vSeed);
    float pulse = smoothstep(0.14, 0.0, abs(vProg - p)) * isOn;

    vec3 base = mix(uA, uB, step(0.5, fract(vSeed * 3.7)) * 0.75);
    vec3 col = mix(base, uB, pulse);
    col = mix(col, vec3(1.0), pulse * 0.5);

    gl_FragColor = vec4(col, uBase + pulse * 0.85);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Textura radial macia usada em nebulosas, satélites e no brilho do cursor. */
function makeGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeGlowSprite(map: THREE.Texture, color: string, opacity: number, scale: number) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map,
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    }),
  );
  sprite.scale.setScalar(scale);
  return sprite;
}

/** Wireframe poliédrico com atributos para o pulso de energia por aresta. */
function makeNet(radius: number, detail: number, base: number, a: string, b: string) {
  const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius, detail));
  const n = edges.attributes.position.count;
  const prog = new Float32Array(n);
  const seed = new Float32Array(n);
  for (let i = 0; i < n; i += 2) {
    const s = Math.random();
    prog[i] = 0;
    prog[i + 1] = 1;
    seed[i] = seed[i + 1] = s;
  }
  edges.setAttribute("aProg", new THREE.BufferAttribute(prog, 1));
  edges.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: NET_VERT,
    fragmentShader: NET_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uBase: { value: base },
      uA: { value: new THREE.Color(a) },
      uB: { value: new THREE.Color(b) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.LineSegments(edges, mat);
}

/** Anel orbital inclinado com um satélite luminoso. */
function makeOrbit(radius: number, color: string, glow: THREE.Texture) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 160; i++) {
    const a = (i / 160) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const sat = makeGlowSprite(glow, color, 0.95, 1.5);
  ring.add(sat);
  return { ring, sat, radius };
}

/**
 * Fundo 3D fixo: planeta de energia (esfera + redes com pulsos), anéis orbitais com
 * satélites, nuvem de partículas brilhantes, nebulosas e cometas. Reage ao cursor
 * (repulsão + luz), ao clique (onda de energia) e à rolagem (profundidade).
 * Qualidade por tier de hardware; pausa quando a aba está oculta e respeita reduced-motion.
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
    scene.fog = new THREE.FogExp2(FUNDO, 0.03);

    const camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      160,
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
    const pr = Math.min(window.devicePixelRatio, cfg.pixelRatio);
    renderer.setPixelRatio(pr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    // Começa invisível e aparece com fade (ver classes do container).
    el.style.opacity = "0";
    el.appendChild(renderer.domElement);

    const glowTex = makeGlowTexture();
    const world = new THREE.Group();
    scene.add(world);

    /* --- nebulosas (profundidade e cor de fundo) --- */
    const nebulaA = makeGlowSprite(glowTex, ROXO_PROFUNDO, 0.26, 62);
    nebulaA.position.set(-20, 9, -26);
    const nebulaB = makeGlowSprite(glowTex, VERDE, 0.1, 54);
    nebulaB.position.set(24, -11, -30);
    const nebulaC = makeGlowSprite(glowTex, ROXO, 0.14, 46);
    nebulaC.position.set(6, 16, -34);
    scene.add(nebulaA, nebulaB, nebulaC);

    /* --- partículas --- */
    const count = cfg.count;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const roxo = new THREE.Color(ROXO);
    const verde = new THREE.Color(VERDE);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // ~65% em tons de roxo (com um toque de verde), ~35% verdes.
      tmp
        .copy(roxo)
        .lerp(verde, Math.random() < 0.35 ? 0.85 + Math.random() * 0.15 : Math.random() * 0.45);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
      scales[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: cfg.size * pr * 2.6 },
        uScale: { value: window.innerHeight / 2 },
        uAspect: { value: window.innerWidth / window.innerHeight },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uBurst: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    world.add(points);

    /* --- esfera central --- */
    const coreMat = new THREE.ShaderMaterial({
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uBurst: { value: 0 },
        uA: { value: new THREE.Color(ROXO_PROFUNDO) },
        uB: { value: new THREE.Color(VERDE) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(6, cfg.sphereSegments, cfg.sphereSegments),
      coreMat,
    );
    world.add(core);

    /* --- redes wireframe com pulsos --- */
    const netOuter = makeNet(11, cfg.wireDetail, cfg.wireOpacity, ROXO, VERDE);
    const netInner = makeNet(8, 1, cfg.wireOpacity * 0.9, ROXO_PROFUNDO, ROXO);
    world.add(netOuter, netInner);
    const nets = [netOuter, netInner];

    /* --- anéis orbitais + satélites --- */
    const orbitDefs = [
      { r: 14, color: VERDE, tiltX: 1.15, tiltZ: 0.2, speed: 0.35 },
      { r: 17, color: ROXO, tiltX: -0.65, tiltZ: -0.5, speed: -0.24 },
      { r: 20, color: VERDE, tiltX: 0.3, tiltZ: 1.0, speed: 0.17 },
    ].slice(0, cfg.orbits);
    const orbits = orbitDefs.map((def, i) => {
      const o = makeOrbit(def.r, def.color, glowTex);
      o.ring.rotation.set(def.tiltX, 0, def.tiltZ);
      world.add(o.ring);
      return { ...o, speed: def.speed, phase: i * 2.1 };
    });

    /* --- brilho que segue o cursor --- */
    const cursorGlow = makeGlowSprite(glowTex, ROXO, 0, 9);
    scene.add(cursorGlow);

    /* --- cometas --- */
    const comets = Array.from({ length: cfg.comets }, (_, i) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      // cabeça clara -> cauda preta (invisível com blending aditivo)
      const head = new THREE.Color("#d9ffe6");
      g.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array([head.r, head.g, head.b, 0, 0, 0]), 3),
      );
      const line = new THREE.LineSegments(
        g,
        new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
        }),
      );
      line.frustumCulled = false;
      line.visible = false;
      scene.add(line);
      return {
        line,
        active: false,
        headPos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        next: 3 + i * 4 + Math.random() * 4,
      };
    });

    /* --- interação --- */
    const target = { x: 0, y: 0 }; // -1..1 (y positivo = para baixo)
    const current = { x: 0, y: 0 };
    const mouse = mat.uniforms.uMouse.value as THREE.Vector2;
    let hasPointer = false;
    let lastMove = -1e9;
    let burst = 0;
    let scrollT = 0;
    let scrollC = 0;

    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!hasPointer) {
        hasPointer = true;
        mouse.set(target.x, -target.y);
      }
      lastMove = performance.now();
    };
    const onDown = () => {
      burst = 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollT = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    scrollC = scrollT;

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mat.uniforms.uScale.value = window.innerHeight / 2;
        mat.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        onScroll();
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
    let prev = 0;
    let shown = false;

    const ndcVec = new THREE.Vector3();
    const dirVec = new THREE.Vector3();

    const spawnComet = (c: (typeof comets)[number]) => {
      c.headPos.set(32 + Math.random() * 8, 8 + Math.random() * 10, -6 - Math.random() * 10);
      c.vel.set(-1, -0.42 - Math.random() * 0.2, 0).normalize().multiplyScalar(26 + Math.random() * 12);
      c.active = true;
      c.line.visible = true;
    };

    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      const t = (now - start) / 1000;
      const dt = Math.min(0.1, prev ? t - prev : 0.016);
      prev = t;

      // suavização do cursor e da rolagem
      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;
      scrollC += (scrollT - scrollC) * 0.06;
      if (hasPointer) {
        mouse.x += (current.x - mouse.x) * 0.18;
        mouse.y += (-current.y - mouse.y) * 0.18;
      }
      burst *= Math.exp(-dt * 2.4);

      // uniforms
      mat.uniforms.uTime.value = t;
      mat.uniforms.uBurst.value = burst;
      coreMat.uniforms.uTime.value = t;
      coreMat.uniforms.uBurst.value = burst;
      for (const n of nets) (n.material as THREE.ShaderMaterial).uniforms.uTime.value = t;

      // movimento do "mundo": parallax do mouse + profundidade pela rolagem
      world.rotation.y = t * 0.02 + current.x * 0.3 + scrollC * 2.4;
      world.rotation.x = current.y * 0.2 + scrollC * 0.5;
      world.position.y = scrollC * 3;
      points.rotation.y = t * 0.012;
      core.rotation.y = t * 0.05;
      core.scale.setScalar(1 + burst * 0.05 + Math.sin(t * 1.3) * 0.012);
      netOuter.rotation.y = -t * 0.035;
      netOuter.rotation.x = t * 0.02;
      netInner.rotation.y = t * 0.06;
      netInner.rotation.z = -t * 0.03;

      for (const o of orbits) {
        const a = t * o.speed + o.phase;
        o.sat.position.set(Math.cos(a) * o.radius, Math.sin(a) * o.radius, 0);
      }

      nebulaA.position.x = -20 + Math.sin(t * 0.05) * 3;
      nebulaB.position.y = -11 + Math.cos(t * 0.04) * 2.5;
      nebulaC.position.x = 6 + Math.cos(t * 0.03) * 3;

      // câmera
      camera.position.x += (current.x * 2.2 - camera.position.x) * 0.05;
      camera.position.y += (-current.y * 1.6 - camera.position.y) * 0.05;
      camera.position.z = 22 - scrollC * 3;
      camera.lookAt(0, 0, 0);

      // luz do cursor projetada no plano z = 0
      const idle = !hasPointer || now - lastMove > 2500;
      const mat2 = cursorGlow.material as THREE.SpriteMaterial;
      mat2.opacity += ((idle ? 0 : 0.2) - mat2.opacity) * 0.08;
      if (mat2.opacity > 0.004) {
        ndcVec.set(mouse.x, mouse.y, 0.5).unproject(camera);
        dirVec.copy(ndcVec).sub(camera.position).normalize();
        const k = -camera.position.z / dirVec.z;
        cursorGlow.position.copy(camera.position).addScaledVector(dirVec, k);
        cursorGlow.visible = true;
      } else {
        cursorGlow.visible = false;
      }

      // cometas
      for (const c of comets) {
        if (!c.active) {
          if (t >= c.next) spawnComet(c);
          continue;
        }
        c.headPos.addScaledVector(c.vel, dt);
        const tailLen = 7;
        dirVec.copy(c.vel).normalize().multiplyScalar(-tailLen);
        const attr = c.line.geometry.attributes.position as THREE.BufferAttribute;
        attr.setXYZ(0, c.headPos.x, c.headPos.y, c.headPos.z);
        attr.setXYZ(1, c.headPos.x + dirVec.x, c.headPos.y + dirVec.y, c.headPos.z + dirVec.z);
        attr.needsUpdate = true;
        if (c.headPos.x < -42 || c.headPos.y < -28) {
          c.active = false;
          c.line.visible = false;
          c.next = t + 6 + Math.random() * 8;
        }
      }

      renderer.render(scene, camera);

      if (!shown) {
        shown = true;
        // Fade-in suave após o primeiro frame renderizado.
        requestAnimationFrame(() => {
          el.style.opacity = "";
        });
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose?.();
        const material = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((x) => x.dispose());
        else material?.dispose?.();
      });
      glowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={holder}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90 transition-opacity duration-[1600ms] ease-out [mask-image:radial-gradient(85%_75%_at_50%_38%,#000_55%,transparent_100%)]"
    />
  );
}
