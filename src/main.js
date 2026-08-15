import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- SCENE & ENGINE INITIALIZATION ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2('#030408', 0.03);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 11);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;

// --- LUXURY LIGHTING SETUP ---
const ambientLight = new THREE.AmbientLight(0x2a1a08, 2.5);
scene.add(ambientLight);

const goldLight = new THREE.DirectionalLight(0xf59e0b, 5.0);
goldLight.position.set(6, 12, 8);
scene.add(goldLight);

const roseLight = new THREE.PointLight(0xfb7185, 6.0, 35);
roseLight.position.set(-7, -4, 5);
scene.add(roseLight);

const violetLight = new THREE.PointLight(0x9333ea, 4.0, 30);
violetLight.position.set(7, -10, 4);
scene.add(violetLight);

const cursorLight = new THREE.PointLight(0xfef08a, 4.0, 15);
scene.add(cursorLight);

// --- GOLDEN FRAGRANCE DUST & SPARKLE FIELD ---
const particleCount = 1500;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  particlePositions[i] = (Math.random() - 0.5) * 45;
  particlePositions[i + 1] = (Math.random() - 0.5) * 45;
  particlePositions[i + 2] = (Math.random() - 0.5) * 45;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0xf59e0b,
  size: 0.1,
  transparent: true,
  opacity: 0.7,
  blending: THREE.AdditiveBlending,
});

const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// --- 3D PERFUME BOTTLE ASSEMBLY ---
const perfumeBottleGroup = new THREE.Group();
perfumeBottleGroup.name = 'PERFUME_BOTTLE_MASTER';
scene.add(perfumeBottleGroup);

// Materials
const crystalGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.9,
  opacity: 1,
  transparent: true,
  roughness: 0.05,
  ior: 1.52,
  thickness: 1.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  metalness: 0.1,
  reflectivity: 0.9,
});

const liquidGoldMaterial = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  metalness: 0.3,
  roughness: 0.2,
  emissive: 0xd97706,
  emissiveIntensity: 0.45,
});

const roseGoldMetalMaterial = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  metalness: 0.95,
  roughness: 0.08,
  emissive: 0xb45309,
  emissiveIntensity: 0.3,
});

// 1. Glass Body (Octagonal Heavy Crystal Flacon)
const bodyGeo = new THREE.CylinderGeometry(1.3, 1.1, 3.4, 8);
const bottleGlass = new THREE.Mesh(bodyGeo, crystalGlassMaterial);
perfumeBottleGroup.add(bottleGlass);

// 2. Liquid Core Interior
const liquidGeo = new THREE.CylinderGeometry(1.05, 0.88, 2.7, 8);
const liquidCore = new THREE.Mesh(liquidGeo, liquidGoldMaterial);
liquidCore.position.y = -0.1;
perfumeBottleGroup.add(liquidCore);

// 3. Atomizer Collar & Shoulder
const collarGeo = new THREE.CylinderGeometry(0.6, 1.2, 0.5, 8);
const bottleCollar = new THREE.Mesh(collarGeo, roseGoldMetalMaterial);
bottleCollar.position.y = 1.95;
perfumeBottleGroup.add(bottleCollar);

// 4. Gold Spray Nozzle
const nozzleGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16);
const bottleNozzle = new THREE.Mesh(nozzleGeo, roseGoldMetalMaterial);
bottleNozzle.position.y = 2.4;
perfumeBottleGroup.add(bottleNozzle);

// 5. Crystal Faceted Cap (Stopper)
const capGeo = new THREE.OctahedronGeometry(0.75, 1);
const bottleCap = new THREE.Mesh(capGeo, crystalGlassMaterial);
bottleCap.position.y = 3.2;
bottleCap.scale.set(1, 1.3, 1);
perfumeBottleGroup.add(bottleCap);

// Position bottle group at hero section
perfumeBottleGroup.position.set(2.6, 0.2, -1);

// --- FLOATING CRYSTAL PETALS & HALO RINGS ---
// Halo Rings
const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 16, 100);
const ringMesh = new THREE.Mesh(ringGeo, roseGoldMetalMaterial);
ringMesh.position.set(0, -12, -4);
ringMesh.rotation.x = Math.PI / 2.5;
ringMesh.name = 'GOLDEN_HALO_RING';
scene.add(ringMesh);

// Floating Gem Constellation
const gemsGroup = new THREE.Group();
scene.add(gemsGroup);

const gemGeo1 = new THREE.IcosahedronGeometry(0.45, 0);
const gemGeo2 = new THREE.OctahedronGeometry(0.4, 0);

const gemMatGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
const gemMatAmethyst = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.8, roughness: 0.15 });

for (let i = 0; i < 8; i++) {
  const isGold = i % 2 === 0;
  const gem = new THREE.Mesh(isGold ? gemGeo1 : gemGeo2, isGold ? gemMatGold : gemMatAmethyst);
  const angle = (i / 8) * Math.PI * 2;
  gem.position.set(Math.cos(angle) * 4.5, -12, Math.sin(angle) * 4.5 - 3);
  gem.name = `CRYSTAL_GEM_${i + 1}`;
  gemsGroup.add(gem);
}

// --- 3D EXTRUDED TEXT CREATION ---
const fontLoader = new FontLoader();
let textMesh1, textMesh2;
const interactiveObjects = [bottleGlass, bottleCap, ringMesh];

fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
    // 3D Text 1: "L'ELIXIR"
    const textGeo1 = new TextGeometry("L'ELIXIR", {
      font: font,
      size: 0.85,
      height: 0.22,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 5,
    });
    textGeo1.center();

    textMesh1 = new THREE.Mesh(
      textGeo1,
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xd97706,
        emissiveIntensity: 0.4,
      })
    );
    textMesh1.position.set(-2.2, 1.8, -1);
    textMesh1.name = 'TEXT_L_ELIXIR';
    scene.add(textMesh1);
    interactiveObjects.push(textMesh1);

    // 3D Text 2: "NOCTURNE"
    const textGeo2 = new TextGeometry('NOCTURNE', {
      font: font,
      size: 0.75,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 4,
    });
    textGeo2.center();

    textMesh2 = new THREE.Mesh(
      textGeo2,
      new THREE.MeshStandardMaterial({
        color: 0xfb7185,
        metalness: 0.95,
        roughness: 0.08,
        emissive: 0xe11d48,
        emissiveIntensity: 0.5,
      })
    );
    textMesh2.position.set(0, -6.5, -1);
    textMesh2.name = 'TEXT_NOCTURNE';
    scene.add(textMesh2);
    interactiveObjects.push(textMesh2);
  },
  undefined,
  (err) => console.warn('Font loading fallback:', err)
);

// --- MOUSE TRACKING & RAYCASTING ---
const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let hoveredObject = null;

const hoverTooltip = document.getElementById('hover-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipSub = document.getElementById('tooltip-sub');
const hudHoverState = document.getElementById('hud-hover-state');
const hudTargetName = document.getElementById('hud-target-name');

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Move point light with cursor
  cursorLight.position.x = mouse.x * 6;
  cursorLight.position.y = mouse.y * 4 + camera.position.y;
  cursorLight.position.z = camera.position.z - 3;

  if (hoveredObject && hoverTooltip) {
    hoverTooltip.style.left = `${e.clientX + 15}px`;
    hoverTooltip.style.top = `${e.clientY + 15}px`;
  }
});

// --- GSAP SCROLLTRIGGER ANIMATIONS ---
let scrollProgress = 0;

const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: 'main',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.2,
    onUpdate: (self) => {
      scrollProgress = self.progress;
    },
  },
});

// Camera Path
scrollTimeline
  .to(camera.position, { y: -6.5, z: 8.5, x: 1.2, ease: 'power1.inOut' }, 0)
  .to(camera.rotation, { x: 0.12, y: 0.1, ease: 'power1.inOut' }, 0)

  .to(camera.position, { y: -13.0, z: 8.0, x: -1.5, ease: 'power1.inOut' }, 1)
  .to(camera.rotation, { x: -0.1, y: -0.12, ease: 'power1.inOut' }, 1)

  .to(camera.position, { y: -19.5, z: 11, x: 0, ease: 'power1.inOut' }, 2)
  .to(camera.rotation, { x: 0, y: 0, ease: 'power1.inOut' }, 2);

// Perfume Bottle & Halo Scroll Motions
scrollTimeline
  .to(perfumeBottleGroup.rotation, { y: Math.PI * 4, x: Math.PI * 0.4, ease: 'none' }, 0)
  .to(perfumeBottleGroup.position, { x: -1.8, y: -7.0, z: -1, ease: 'none' }, 0)

  .to(perfumeBottleGroup.rotation, { y: Math.PI * 8, z: Math.PI * 0.2, ease: 'none' }, 1)
  .to(perfumeBottleGroup.position, { x: 0, y: -13.2, z: -2, ease: 'none' }, 1)

  .to(ringMesh.rotation, { z: Math.PI * 4, ease: 'none' }, 1);

// --- TELEMETRY HUD UPDATER ---
const hudPosX = document.getElementById('hud-pos-x');
const hudPosY = document.getElementById('hud-pos-y');
const hudPosZ = document.getElementById('hud-pos-z');
const hudPitch = document.getElementById('hud-pitch');
const hudYaw = document.getElementById('hud-yaw');
const hudRoll = document.getElementById('hud-roll');
const hudScrollPct = document.getElementById('hud-scroll-pct');
const hudScrollBar = document.getElementById('hud-scroll-bar');
const topProgressBar = document.getElementById('top-progress-bar');
const hudFps = document.getElementById('hud-fps');

let frameCount = 0;
let lastTime = performance.now();

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // FPS Counter
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    if (hudFps) hudFps.innerText = `${frameCount} FPS`;
    frameCount = 0;
    lastTime = currentTime;
  }

  // Smooth Mouse Lerp
  targetMouse.x += (mouse.x - targetMouse.x) * 0.05;
  targetMouse.y += (mouse.y - targetMouse.y) * 0.05;

  // Gentle Flacon & Gem Idle Floating
  perfumeBottleGroup.position.y += Math.sin(elapsedTime * 1.5) * 0.003;
  gemsGroup.rotation.y = elapsedTime * 0.35;
  particleSystem.rotation.y = elapsedTime * 0.05;

  // Parallax Scene Tilt
  scene.rotation.y = targetMouse.x * 0.12;
  scene.rotation.x = -targetMouse.y * 0.12;

  // Raycast Hover Interaction
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);

  if (intersects.length > 0) {
    const hitObj = intersects[0].object;

    if (hoveredObject !== hitObj) {
      if (hoveredObject) {
        gsap.to(hoveredObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      }
      hoveredObject = hitObj;
      gsap.to(hoveredObject.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3 });

      if (hoverTooltip) {
        hoverTooltip.style.opacity = '1';
        tooltipTitle.innerText = hoveredObject.name || 'CRYSTAL_FACET';
      }
      if (hudHoverState) {
        hudHoverState.innerText = 'HOVERED';
        hudHoverState.className = 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40';
      }
      if (hudTargetName) {
        hudTargetName.innerText = hoveredObject.name || 'ELIXIR_BOTTLE_2026';
      }
    }
    hoveredObject.rotation.y += 0.01;
  } else {
    if (hoveredObject) {
      gsap.to(hoveredObject.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      hoveredObject = null;
      if (hoverTooltip) hoverTooltip.style.opacity = '0';
      if (hudHoverState) {
        hudHoverState.innerText = 'IDLE';
        hudHoverState.className = 'px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-medium border border-amber-500/20';
      }
    }
  }

  // Active Target Selection
  let activeTarget = perfumeBottleGroup;
  if (hoveredObject) activeTarget = hoveredObject;

  // Telemetry HUD Updates
  const targetPos = activeTarget.position;
  if (hudPosX) hudPosX.innerText = (targetPos.x >= 0 ? '+' : '') + targetPos.x.toFixed(2);
  if (hudPosY) hudPosY.innerText = (targetPos.y >= 0 ? '+' : '') + targetPos.y.toFixed(2);
  if (hudPosZ) hudPosZ.innerText = (targetPos.z >= 0 ? '+' : '') + targetPos.z.toFixed(2);

  const pitchDeg = (activeTarget.rotation.x * (180 / Math.PI)) % 360;
  const yawDeg = (activeTarget.rotation.y * (180 / Math.PI)) % 360;
  const rollDeg = (activeTarget.rotation.z * (180 / Math.PI)) % 360;

  if (hudPitch) hudPitch.innerText = `${pitchDeg.toFixed(1)}°`;
  if (hudYaw) hudYaw.innerText = `${yawDeg.toFixed(1)}°`;
  if (hudRoll) hudRoll.innerText = `${rollDeg.toFixed(1)}°`;

  const scrollPctString = `${(scrollProgress * 100).toFixed(1)}%`;
  if (hudScrollPct) hudScrollPct.innerText = scrollPctString;
  if (hudScrollBar) hudScrollBar.style.width = scrollPctString;
  if (topProgressBar) topProgressBar.style.width = scrollPctString;

  if (hoveredObject && tooltipSub) {
    tooltipSub.innerText = `Pos: (${targetPos.x.toFixed(1)}, ${targetPos.y.toFixed(1)}) | Yaw: ${yawDeg.toFixed(0)}°`;
  }

  renderer.render(scene, camera);
}

// Window Resize Listener
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// UI Handlers
const toggleHudBtn = document.getElementById('toggle-hud-btn');
const telemetryHud = document.getElementById('telemetry-hud');

toggleHudBtn?.addEventListener('click', () => {
  if (telemetryHud.classList.contains('opacity-0')) {
    telemetryHud.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    telemetryHud.classList.add('opacity-100', 'translate-y-0');
  } else {
    telemetryHud.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    telemetryHud.classList.remove('opacity-100', 'translate-y-0');
  }
});

const resetScrollBtn = document.getElementById('reset-scroll-btn');
resetScrollBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Start loop
animate();
