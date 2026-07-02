/*
 * protolab.tech — NEGENTROPY
 * One continuous GLSL point-cloud simulation, parameterized by scroll progress.
 * States: NOISE -> FIELD -> ORDER -> DRIFT -> RESOLVE -> STATE (wordmark).
 *
 * Stack: three.js (raw GLSL ShaderMaterial) + Lenis (smooth scroll) +
 * GSAP ScrollTrigger (scroll-driven copy/state). No build step — the site
 * stays a static page; three is pulled as an ESM module via import map.
 */
import * as THREE from 'three';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 720px)').matches ||
  ('ontouchstart' in window && window.innerWidth < 900);

const CHAPTERS = ['NOISE', 'FIELD', 'ORDER', 'DRIFT', 'RESOLVE', 'STATE'];

// Accent palette per chapter: steel -> cyan -> white.
const ACCENTS = ['#5b6b7a', '#6f8aa3', '#5f9bb0', '#57c9c2', '#9fe8e2', '#eef3f6'];
// Mobile locks a single accent.
const MOBILE_ACCENT = '#57c9c2';

const COUNT = isMobile ? 13000 : 52000;

const dom = {
  canvas: document.getElementById('gl'),
  boot: document.querySelector('.boot'),
  hint: document.querySelector('.scroll-hint'),
  idx: Array.from(document.querySelectorAll('.hud-tr .idx')),
  fill: document.querySelector('.hud-tr .fill'),
  pct: document.querySelector('.hud-tr .pct'),
  secnum: document.querySelector('.hud-bl .secnum'),
  secname: document.querySelector('.hud-bl .secname'),
  cx: document.querySelector('.hud-bl .cx'),
  cy: document.querySelector('.hud-bl .cy'),
  fps: document.querySelector('.hud-br .fps'),
  ncount: document.querySelector('.hud-br .ncount'),
  npoints: document.querySelector('.npoints'),
  lines: Array.from(document.querySelectorAll('.chapter .line')),
  sections: Array.from(document.querySelectorAll('.chapter')),
};

/* ----------------------------------------------------------------------------
 * Build the wordmark target positions by rasterizing "protolab.tech" to a
 * canvas and sampling its filled pixels. Returns a Float32Array of length 3*n.
 * ------------------------------------------------------------------------- */
function buildWordmarkTargets(count) {
  const cw = 1024, ch = 256;
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 150px "Space Grotesk", system-ui, sans-serif';
  const word = 'protolab.tech';
  ctx.fillText(word, cw / 2, ch / 2 + 6);
  const textWpx = ctx.measureText(word).width;

  const data = ctx.getImageData(0, 0, cw, ch).data;
  const filled = [];
  // sample on a small stride for performance, keep coords that are lit
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (data[(y * cw + x) * 4] > 128) filled.push(x, y);
    }
  }

  // Bake in normalized canvas space: full canvas width spans 1.0 unit.
  // World position is (xy * uTextScale) so the cloud can be matched to the
  // on-screen wordmark size at runtime, aspect preserved.
  const out = new Float32Array(count * 3);
  const n = filled.length / 2;
  if (n === 0) return { array: out, textWpx, cw };

  for (let i = 0; i < count; i++) {
    const s = (Math.random() * n) | 0;
    const px = filled[s * 2];
    const py = filled[s * 2 + 1];
    const jx = (Math.random() - 0.5) * 1.6;
    const jy = (Math.random() - 0.5) * 1.6;
    out[i * 3] = (px + jx) / cw - 0.5;
    out[i * 3 + 1] = -((py + jy) / cw - (ch / cw) * 0.5);
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
  }
  return { array: out, textWpx, cw };
}

/* ----------------------------------------------------------------------------
 * GLSL
 * ------------------------------------------------------------------------- */
const VERT = /* glsl */`
uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3  uAccent;
uniform float uTimeScale;
uniform float uTextScale;

attribute vec3  aSeed;
attribute vec3  aGrid;
attribute vec3  aText;
attribute float aId;

varying float vAlpha;
varying vec3  vColor;
varying float vGlow;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 snoiseVec3(vec3 x){
  return vec3(
    snoise(x),
    snoise(x + vec3(123.4, 256.7, -78.9)),
    snoise(x + vec3(-31.2, 98.5, 201.1))
  );
}

vec3 curl(vec3 p){
  const float e = 0.12;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);
  vec3 px0 = snoiseVec3(p - dx), px1 = snoiseVec3(p + dx);
  vec3 py0 = snoiseVec3(p - dy), py1 = snoiseVec3(p + dy);
  vec3 pz0 = snoiseVec3(p - dz), pz1 = snoiseVec3(p + dz);
  float x = (py1.z - py0.z) - (pz1.y - pz0.y);
  float y = (pz1.x - pz0.x) - (px1.z - px0.z);
  float z = (px1.y - px0.y) - (py1.x - py0.x);
  return vec3(x, y, z) / (2.0 * e);
}

// --- the six states of the single system ---

vec3 stateNoise(float t){
  vec3 base = aSeed * 23.0;
  vec3 flow = curl(aSeed * 0.22 + t * 0.05) * 7.0;
  return base + flow;
}

vec3 stateField(float t){
  float x = aGrid.x * 1.3;
  float z = aGrid.z * 1.3;
  float y = sin(x * 0.18 + t * 0.35) * 2.3 + cos(z * 0.2 - t * 0.28) * 2.0;
  y += snoise(vec3(x * 0.1, z * 0.1, t * 0.06)) * 1.6;
  return vec3(x, y + aGrid.y * 0.04, z);
}

vec3 stateOrder(float t){
  // a held lattice, with an almost-imperceptible settle
  return aGrid + curl(aGrid * 0.04 + t * 0.02) * 0.18;
}

vec3 stateDrift(float t){
  vec3 d = curl(aGrid * 0.06 + t * 0.05) * (3.2 + 1.6 * sin(t * 0.2 + aId * 6.0));
  return aGrid + d;
}

vec3 stateResolve(float t){
  vec3 dir = normalize(aSeed + 0.0001);
  float r = 12.5 + snoise(aSeed * 1.5 + t * 0.1) * 0.9;
  vec3 sph = dir * r;
  float a = t * 0.16;
  float ca = cos(a), sa = sin(a);
  sph.xz = mat2(ca, -sa, sa, ca) * sph.xz;
  return sph;
}

vec3 stateWordmark(float t){
  vec3 p = aText * uTextScale;
  p.z += sin(t * 0.6 + aId * 30.0) * 0.22;
  p.x += sin(t * 0.4 + aId * 12.0) * 0.04;
  return p;
}

vec3 posForIndex(int i, float t){
  if (i <= 0) return stateNoise(t);
  else if (i == 1) return stateField(t);
  else if (i == 2) return stateOrder(t);
  else if (i == 3) return stateDrift(t);
  else if (i == 4) return stateResolve(t);
  return stateWordmark(t);
}

void main(){
  float t = uTime * uTimeScale;

  float segf = clamp(uProgress, 0.0, 1.0) * 5.0;
  float seg = floor(segf);
  float f = smoothstep(0.0, 1.0, fract(segf));
  int i0 = int(seg);
  int i1 = int(min(seg + 1.0, 5.0));

  vec3 pA = posForIndex(i0, t);
  vec3 pB = posForIndex(i1, t);
  vec3 pos = mix(pA, pB, f);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = uSize * (0.6 + aId * 1.0);
  gl_PointSize = size * uPixelRatio * (62.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 16.0);

  float depth = clamp((-mvPosition.z - 6.0) / 64.0, 0.0, 1.0);
  vAlpha = 1.0 - depth * 0.82;

  // cooler, dimmer points fade toward background; a few read brighter
  vColor = uAccent * (0.7 + aId * 0.5);
  vGlow = smoothstep(0.7, 1.0, aId);
}
`;

const FRAG = /* glsl */`
precision highp float;
uniform float uOpacity;
varying float vAlpha;
varying vec3  vColor;
varying float vGlow;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  // tight, hard-edged core with a faint halo — crisp instead of blurry
  float core = smoothstep(0.34, 0.16, d);
  float halo = smoothstep(0.5, 0.24, d) * 0.22;
  float alpha = (core + halo) * vAlpha * uOpacity;
  if (alpha < 0.003) discard;
  vec3 col = vColor + vGlow * 0.18;
  gl_FragColor = vec4(col, alpha);
}
`;

/* ----------------------------------------------------------------------------
 * Engine
 * ------------------------------------------------------------------------- */
function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: dom.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    return fallback();
  }
  if (!renderer || !renderer.getContext()) return fallback();

  // full device pixel ratio (capped at 2) for a crisp render
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050507, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 40);

  const group = new THREE.Group();
  // On narrow/portrait screens the field is scaled down so the whole structure
  // stays in frame; the wordmark match compensates so it still resolves cleanly.
  const SIM_SCALE = isMobile ? 0.58 : 1.0;
  group.scale.setScalar(SIM_SCALE);
  scene.add(group);

  // attributes
  const seeds = new Float32Array(COUNT * 3);
  const grid = new Float32Array(COUNT * 3);
  const ids = new Float32Array(COUNT);

  const side = Math.ceil(Math.cbrt(COUNT));
  const L = 26;
  for (let i = 0; i < COUNT; i++) {
    // random seed vector for noise scatter / sphere direction
    seeds[i * 3] = Math.random() * 2 - 1;
    seeds[i * 3 + 1] = Math.random() * 2 - 1;
    seeds[i * 3 + 2] = Math.random() * 2 - 1;

    // lattice
    const ix = i % side;
    const iy = Math.floor(i / side) % side;
    const iz = Math.floor(i / (side * side));
    grid[i * 3] = (ix / (side - 1) - 0.5) * L;
    grid[i * 3 + 1] = (iy / (side - 1) - 0.5) * L;
    grid[i * 3 + 2] = (iz / (side - 1) - 0.5) * L;

    ids[i] = Math.random();
  }
  const textData = buildWordmarkTargets(COUNT);

  const geo = new THREE.BufferGeometry();
  // position attribute required by three; actual position is computed in shader
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
  geo.setAttribute('aGrid', new THREE.BufferAttribute(grid, 3));
  geo.setAttribute('aText', new THREE.BufferAttribute(textData.array, 3));
  geo.setAttribute('aId', new THREE.BufferAttribute(ids, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 80);

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uSize: { value: isMobile ? 3.4 : 2.7 },
    uOpacity: { value: 0.92 },
    uPixelRatio: { value: pixelRatio },
    uAccent: { value: new THREE.Color(isMobile ? MOBILE_ACCENT : ACCENTS[0]) },
    uTimeScale: { value: prefersReduced ? 0.25 : 1.0 },
    uTextScale: { value: 44 },
  };

  const RESOLVE_Z = 34; // camera z when the system fully resolves

  // Match the particle wordmark to the on-screen crisp wordmark so the cloud
  // resolves precisely onto it. Re-run on resize / font load.
  const wordmarkEl = document.querySelector('#state .wordmark');
  function computeTextScale() {
    const w = window.innerWidth, h = window.innerHeight;
    const visW = 2 * Math.tan((46 * Math.PI / 180) / 2) * RESOLVE_Z * (w / h);
    const worldPerPx = visW / w;
    let wcss = 0;
    if (wordmarkEl) wcss = wordmarkEl.getBoundingClientRect().width;
    if (!wcss) wcss = w * 0.6;
    const worldTextW = wcss * worldPerPx;
    // textData.textWpx / cw = fraction of canvas the glyphs occupy.
    // Divide by SIM_SCALE so the group scale cancels out and the wordmark still
    // lands exactly on the crisp HTML wordmark.
    uniforms.uTextScale.value = worldTextW * (textData.cw / textData.textWpx) / SIM_SCALE;
  }
  computeTextScale();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(computeTextScale);
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  group.add(points);

  // boot done
  if (dom.boot) {
    dom.boot.classList.add('gone');
    setTimeout(() => dom.boot && dom.boot.remove(), 900);
  }
  if (dom.npoints) dom.npoints.textContent = COUNT.toLocaleString('en-US');
  if (dom.ncount) dom.ncount.textContent = COUNT.toLocaleString('en-US');

  // ---- scroll progress & HUD state ----
  let targetProgress = 0;
  let progress = 0;
  let activeChapter = -1;
  const targetAccent = new THREE.Color(isMobile ? MOBILE_ACCENT : ACCENTS[0]);
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  function readScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  }

  function setChapter(i) {
    if (i === activeChapter) return;
    activeChapter = i;
    dom.idx.forEach((el, k) => {
      el.classList.toggle('active', k === i);
      el.classList.toggle('past', k < i);
    });
    if (dom.secnum) dom.secnum.textContent = String(i + 1).padStart(3, '0');
    if (dom.secname) dom.secname.textContent = CHAPTERS[i];
    if (!isMobile) targetAccent.set(ACCENTS[i]);
    document.documentElement.style.setProperty('--accent', isMobile ? MOBILE_ACCENT : ACCENTS[i]);
  }

  // copy reveal + active-chapter detection driven by live section geometry
  // (robust across native scroll, Lenis, and reduced-motion).
  function updateCopy() {
    const vh = window.innerHeight;
    let closest = 0;
    let closestDist = Infinity;
    for (let k = 0; k < dom.sections.length; k++) {
      const sec = dom.sections[k];
      const line = dom.lines[k];
      if (!line) continue;
      const rect = sec.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = (center - vh / 2) / vh; // 0 when centered
      if (Math.abs(dist) < closestDist) {
        closestDist = Math.abs(dist);
        closest = k;
      }
      let o, ty;
      if (k === dom.sections.length - 1) {
        // STATE: rise in and hold
        o = THREE.MathUtils.clamp(1 - dist * 1.4, 0, 1);
        ty = THREE.MathUtils.clamp(dist, -0.4, 1) * 26;
      } else {
        o = THREE.MathUtils.clamp(1 - Math.abs(dist) * 1.7, 0, 1);
        ty = dist * 30;
      }
      line.style.opacity = o.toFixed(3);
      line.style.transform = `translateY(${ty.toFixed(1)}px)`;
    }
    setChapter(closest);
  }

  // ScrollTrigger keeps Lenis and the scroll system in sync (smooth,
  // scroll-driven state); chapter/morph state is read from geometry each frame.
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  // ---- Lenis smooth scroll (skip when reduced motion) ----
  let lenis = null;
  if (!prefersReduced && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      smoothWheel: true,
      lerp: 0.09,
      wheelMultiplier: 0.9,
    });
    if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update);
  }

  // clicking a text cluster advances the sequence to the next section
  function scrollToSection(k) {
    const sec = dom.sections[k];
    if (!sec) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    if (lenis) lenis.scrollTo(top, { duration: 1.6 });
    else window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  }
  dom.lines.forEach((line, k) => {
    if (k >= dom.sections.length - 1) return; // final frame holds
    line.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let bare links navigate
      scrollToSection(k + 1);
    });
  });

  // pointer parallax
  if (!isMobile) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5);
      pointer.ty = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

  // hide scroll hint after first interaction
  let hinted = false;
  function killHint() {
    if (hinted || !dom.hint) return;
    hinted = true;
    dom.hint.style.opacity = '0';
  }
  window.addEventListener('scroll', () => { readScroll(); if (window.scrollY > 30) killHint(); }, { passive: true });
  window.addEventListener('wheel', killHint, { passive: true });
  window.addEventListener('touchmove', killHint, { passive: true });

  // resize
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    computeTextScale();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    readScroll();
  }
  window.addEventListener('resize', onResize);

  // ---- main loop ----
  const clock = new THREE.Clock();
  let lastT = performance.now();

  function frame(now) {
    if (lenis) lenis.raf(now);

    const dt = (now - lastT) / 1000;
    lastT = now;

    // ease progress toward scroll target for buttery morph
    progress += (targetProgress - progress) * 0.08;

    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uProgress.value = progress;

    // accent ease
    uniforms.uAccent.value.lerp(targetAccent, 0.04);

    // group motion: slow auto drift + scroll twist + pointer parallax,
    // damped to zero as the system resolves so the wordmark faces the camera.
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const ts = prefersReduced ? 0.15 : 1.0;
    const damp = 1 - THREE.MathUtils.smoothstep(progress, 0.8, 1.0);
    group.rotation.y = (now * 0.00004 * ts + pointer.x * 0.5 + progress * 0.45) * damp;
    group.rotation.x = (pointer.y * 0.35 + Math.sin(now * 0.0002 * ts) * 0.05) * damp;

    // camera eases in and re-centers as the system resolves
    camera.position.z = 40 - (40 - RESOLVE_Z) * THREE.MathUtils.smoothstep(progress, 0.0, 1.0);
    camera.position.x = pointer.x * 2.0 * damp;
    camera.position.y = -pointer.y * 1.2 * damp;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    // HUD readouts
    if (dom.fill) dom.fill.style.width = (progress * 100).toFixed(2) + '%';
    if (dom.pct) dom.pct.textContent = progress.toFixed(3);
    if (dom.cx) dom.cx.textContent = (pointer.x >= 0 ? '+' : '') + pointer.x.toFixed(2);
    if (dom.cy) dom.cy.textContent = (pointer.y >= 0 ? '+' : '') + pointer.y.toFixed(2);
    if (dom.fps) dom.fps.textContent = dt.toFixed(3);

    updateCopy();

    requestAnimationFrame(frame);
  }

  readScroll();
  updateCopy();
  setChapter(0);
  requestAnimationFrame(frame);
}

/* ----------------------------------------------------------------------------
 * Fallback when WebGL is unavailable: reveal copy statically, kill the canvas.
 * ------------------------------------------------------------------------- */
function fallback() {
  document.documentElement.style.setProperty('--accent', MOBILE_ACCENT);
  if (dom.canvas) dom.canvas.style.display = 'none';
  if (dom.boot) dom.boot.remove();
  if (dom.npoints) dom.npoints.textContent = '0';
  dom.lines.forEach((l) => { l.style.opacity = '1'; l.style.transform = 'none'; });
  if (dom.idx[0]) dom.idx[0].classList.add('active');
}

start();
