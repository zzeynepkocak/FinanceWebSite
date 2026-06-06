/**
 * FinansPortalı Landing — main.js
 * Stack: Three.js (3D spiral galeri) + GSAP ScrollTrigger + Lenis smooth scroll
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════ */
const CFG = {
  bg:           0x0a0a0f,
  tileCount:    28,          // toplam tile sayısı
  tilesPerRev:  7,           // her tur başına tile
  radius:       4.5,         // spiral yarıçapı
  heightStep:   0.72,        // tile'lar arası dikey mesafe
  tileW:        1.9,
  tileH:        1.15,
  // teal-mavi-mor skalası
  palettes: [
    ['#00d4aa', '#0066ff'],
    ['#0066ff', '#6c5ce7'],
    ['#6c5ce7', '#a29bfe'],
    ['#00d4aa', '#4ecdc4'],
    ['#4ecdc4', '#0066ff'],
    ['#a29bfe', '#00d4aa'],
    ['#ff4757', '#6c5ce7'], // biraz kırmızı aksan
  ],
};

/* ══════════════════════════════════════════════
   LENIS SMOOTH SCROLL
══════════════════════════════════════════════ */
const lenis = new Lenis({
  duration:     1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel:  true,
  wheelMultiplier: 1,
});

// Lenis → ScrollTrigger entegrasyonu
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ══════════════════════════════════════════════
   THREE.JS — RENDERER & SCENE
══════════════════════════════════════════════ */
const canvas = document.getElementById('three-canvas');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(CFG.bg, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 120);
camera.position.set(0, 0, 12);

/* ══════════════════════════════════════════════
   YARDIMCI: Canvas texture oluştur
   (her tile için gradient + sahte grafik çizgisi)
══════════════════════════════════════════════ */
function makeTileTexture(color1, color2, index) {
  const W = 512, H = 308;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  /* arka plan gradient */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, color1 + '28');
  bg.addColorStop(1, color2 + '18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* ince border */
  ctx.strokeStyle = color1 + 'aa';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  /* iç yatay grid çizgileri */
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let r = 1; r < 4; r++) {
    const y = (H / 4) * r;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  /* sahte candlestick/sparkline çizgisi */
  const pts = 16;
  ctx.beginPath();
  const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
  lineGrad.addColorStop(0, color1);
  lineGrad.addColorStop(1, color2);
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth   = 2.2;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  for (let i = 0; i <= pts; i++) {
    const x = (i / pts) * W;
    const noise =
      Math.sin(i * 1.8 + index * 0.7) * 0.28 +
      Math.sin(i * 3.3 + index * 1.3) * 0.14;
    const y = H * 0.58 + noise * H * 0.26;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  /* alan dolgu (sparkline altı) */
  ctx.lineTo(W, H); ctx.lineTo(0, H);
  ctx.closePath();
  const areaFill = ctx.createLinearGradient(0, H * 0.3, 0, H);
  areaFill.addColorStop(0, color1 + '22');
  areaFill.addColorStop(1, color1 + '00');
  ctx.fillStyle = areaFill;
  ctx.fill();

  /* sembol etiketi */
  const labels  = ['BIST', 'USD', 'ALTIN', 'BTC', 'ASELS', 'THYAO', 'EUR', 'XAG', 'ETH', 'GARAN'];
  const values  = ['13.915', '38,42', '2.847', '64.120', '44,30', '287,50', '41,85', '31,20', '3.420', '98,40'];
  const changes = ['+0.28%', '+0.15%', '-0.12%', '+1.9%', '+0.9%', '+2.1%', '+0.22%', '-0.45%', '+3.1%', '+0.6%'];

  const li = index % labels.length;

  ctx.fillStyle = color1;
  ctx.font = `bold 26px 'Space Grotesk', monospace`;
  ctx.fillText(labels[li], 18, 36);

  ctx.fillStyle = '#ffffff99';
  ctx.font = `18px 'Space Grotesk', monospace`;
  ctx.fillText(values[li], 18, 60);

  const isUp = !changes[li].startsWith('-');
  ctx.fillStyle = isUp ? '#00d4aa' : '#ff4757';
  ctx.font = `bold 15px 'Space Grotesk', monospace`;
  ctx.fillText((isUp ? '▲ ' : '▼ ') + changes[li], 18, H - 18);

  return new THREE.CanvasTexture(cv);
}

/* ══════════════════════════════════════════════
   SPIRAL TILE GROUP
══════════════════════════════════════════════ */
const spiralGroup = new THREE.Group();
scene.add(spiralGroup);

const baseGeom = new THREE.PlaneGeometry(CFG.tileW, CFG.tileH);

for (let i = 0; i < CFG.tileCount; i++) {
  const angle   = (i / CFG.tilesPerRev) * Math.PI * 2;
  const palette = CFG.palettes[i % CFG.palettes.length];
  const tex     = makeTileTexture(palette[0], palette[1], i);

  const mat = new THREE.MeshBasicMaterial({
    map:         tex,
    side:        THREE.DoubleSide,
    transparent: true,
    opacity:     0.88,
  });

  const mesh = new THREE.Mesh(baseGeom, mat);

  mesh.position.x = Math.cos(angle) * CFG.radius;
  mesh.position.z = Math.sin(angle) * CFG.radius;
  mesh.position.y = i * CFG.heightStep - (CFG.tileCount / 2) * CFG.heightStep;

  // Tile dışa bakacak şekilde döndür
  mesh.rotation.y = -angle;

  spiralGroup.add(mesh);
}

/* Hafif ambient ışık */
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

/* ══════════════════════════════════════════════
   RESIZE HANDLER
══════════════════════════════════════════════ */
function onResize() {
  const hero = document.getElementById('hero');
  const w = hero.clientWidth;
  const h = hero.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
onResize();
window.addEventListener('resize', onResize);

/* ══════════════════════════════════════════════
   MOUSE PARALLAX
══════════════════════════════════════════════ */
let targetMX = 0, targetMY = 0;
let currentMX = 0, currentMY = 0;

window.addEventListener('mousemove', (e) => {
  targetMX = (e.clientX / window.innerWidth  - 0.5) * 2;
  targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ══════════════════════════════════════════════
   SCROLL → spiral rotasyonu
══════════════════════════════════════════════ */
let scrollRatio = 0;

ScrollTrigger.create({
  trigger:  'body',
  start:    'top top',
  end:      'bottom bottom',
  onUpdate: (self) => { scrollRatio = self.progress; },
});

/* ══════════════════════════════════════════════
   ANIMATION LOOP
══════════════════════════════════════════════ */
let clock = 0;

function animate() {
  requestAnimationFrame(animate);
  clock += 0.004;

  // Mouse yumuşatma
  currentMX += (targetMX - currentMX) * 0.05;
  currentMY += (targetMY - currentMY) * 0.05;

  // Spiral Y ekseni: oto-döner + scroll etkisi
  spiralGroup.rotation.y = clock + scrollRatio * Math.PI * 5;
  // Hafif X tilt
  spiralGroup.rotation.x = currentMY * 0.08;

  // Kamera parallax
  camera.position.x += (currentMX * 0.8  - camera.position.x) * 0.04;
  camera.position.y += (-currentMY * 0.5 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

/* ══════════════════════════════════════════════
   GSAP ANIMASYONLARI
══════════════════════════════════════════════ */

/* ── Ticker bar slide-in ── */
gsap.to('#tickerWrap', {
  x: '0%',
  opacity: 1,
  duration: 0.9,
  delay: 0.05,
  ease: 'power3.out',
});

/* ── Navbar drop-in ── */
gsap.to('#navbar', {
  y: 0,
  opacity: 1,
  duration: 0.85,
  delay: 0.2,
  ease: 'power3.out',
});

/* ── Hero eyebrow ── */
gsap.to('.hero-eyebrow', {
  opacity: 1,
  y: 0,
  duration: 0.9,
  delay: 0.45,
  ease: 'power3.out',
});

/* ── Hero başlık — clip-path reveal ── */
gsap.to('.hero-line', {
  clipPath: 'inset(0 0% 0 0)',
  opacity:  1,
  duration: 1.3,
  stagger:  0.22,
  delay:    0.6,
  ease:     'power4.out',
});

/* ── Hero alt metin + CTA ── */
gsap.to('.hero-sub', {
  opacity:  1,
  y: 0,
  duration: 0.9,
  delay:    1.15,
  ease:     'power3.out',
});

gsap.to('.hero-cta', {
  opacity:  1,
  y: 0,
  duration: 0.9,
  delay:    1.4,
  ease:     'power3.out',
});

/* ── Navbar scroll davranışı ── */
ScrollTrigger.create({
  start:    'top -70',
  onUpdate: (self) => {
    document.getElementById('navbar')
      .classList.toggle('is-scrolled', self.scroll() > 70);
  },
});

/* ── Metrik kartları — yukarıdan düşsün ── */
gsap.to('.metric-card', {
  opacity:  1,
  y:        0,
  duration: 0.85,
  stagger:  0.13,
  ease:     'power3.out',
  scrollTrigger: {
    trigger:  '.metrics-grid',
    start:    'top 82%',
  },
});

/* ── Bölüm başlıkları — clip-path reveal ── */
document.querySelectorAll('.section-title').forEach((el) => {
  gsap.fromTo(el,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.3,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 87%' },
    }
  );
});

/* ── Section tag'ler — soldan slide ── */
gsap.utils.toArray('.section-tag').forEach((el) => {
  gsap.from(el, {
    opacity: 0, x: -24,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%' },
  });
});

/* ── Feature card'lar ── */
gsap.to('.feature-card', {
  opacity:  1,
  x:        0,
  duration: 0.75,
  stagger:  0.18,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.feature-cards',
    start:   'top 82%',
  },
});

/* ── Portföy tablo satırları ── */
gsap.to('.portfolio-table tbody tr', {
  opacity:  1,
  x:        0,
  duration: 0.7,
  stagger:  0.12,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.portfolio-table',
    start:   'top 82%',
  },
});

/* ── Tech badge'ler ── */
gsap.to('.tech-badge', {
  opacity:  1,
  scale:    1,
  duration: 0.55,
  stagger:  0.07,
  ease:     'back.out(1.7)',
  scrollTrigger: {
    trigger: '.tech-grid',
    start:   'top 82%',
  },
});

/* ── Senaryo kartları ── */
gsap.to('.scenario-card', {
  opacity:  1,
  y:        0,
  duration: 0.8,
  stagger:  0.14,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.scenarios-grid',
    start:   'top 82%',
  },
});

/* ── CTA başlık ── */
gsap.to('.cta-title', {
  opacity:  1,
  y:        0,
  duration: 1,
  ease:     'power3.out',
  scrollTrigger: {
    trigger: '.cta-block',
    start:   'top 82%',
  },
});

/* ── Section sub metin ── */
gsap.utils.toArray('.section-sub, .cta-sub').forEach((el) => {
  gsap.from(el, {
    opacity: 0, y: 20,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' },
  });
});
