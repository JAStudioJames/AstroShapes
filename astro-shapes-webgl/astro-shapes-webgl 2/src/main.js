import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import approvedLogoSVG from './assets/astro-logo.svg?raw';
import './style.css';

// Menu: collapsed to the brand star, expanded to reveal the full navigation.
const header = document.querySelector('.site-header');
const toggle = document.querySelector('#nav-toggle');
function setMenu(open) {
  header.classList.toggle('expanded', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
setMenu(true);
toggle.addEventListener('click', () => setMenu(!header.classList.contains('expanded')));
document.querySelectorAll('.nav-drawer a').forEach(link => link.addEventListener('click', () => setMenu(false)));

const canvas = document.querySelector('#webgl-canvas');
const wrap = document.querySelector('#webgl-wrap');
const hint = document.querySelector('#drag-hint');
const fallback = document.querySelector('#webgl-fallback');

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0.3, 1.4, 20);
  camera.lookAt(0, 0, 0);

  // Studio HDR reflections are essential for materials with high metalness.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envMap = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envMap;
  room.dispose();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8295ac, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 6.0);
  key.position.set(-4, 8, 11);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9dcff, 4);
  rim.position.set(6, 1, -7);
  scene.add(rim);
  const warm = new THREE.DirectionalLight(0xffd7b3, 1.5);
  warm.position.set(-8, -2, 3);
  scene.add(warm);

  const finishes = {
    aluminum: { color: 0xc5c9d0, metalness: 1, roughness: 0.29, envMapIntensity: 1.6 },
    black: { color: 0x272e37, metalness: 1, roughness: 0.18, envMapIntensity: 1.95 },
    copper: { color: 0xc8774c, metalness: 1, roughness: 0.23, envMapIntensity: 1.8 }
  };

  const faceMat = new THREE.MeshPhysicalMaterial({ ...finishes.aluminum, clearcoat: 0.3, clearcoatRoughness: 0.2 });
  const sideMat = new THREE.MeshPhysicalMaterial({ ...finishes.aluminum, color: 0x989ea8, roughness: 0.35 });
  const logo = new THREE.Group();
  scene.add(logo);

  // The geometry below is built DIRECTLY from the approved Astro.svg outlines.
  // No substitute font, redrawn star or additional cylinder is used.
  const svgLoader = new SVGLoader();
  const svgData = svgLoader.parse(approvedLogoSVG);
  const svgWidth = 303.89;
  const svgHeight = 90.67;
  const logoWidth = 10.8; // scene units; retains the logo's original aspect ratio
  const scale = logoWidth / svgWidth;
  const extrusionDepth = 2.35;

  for (const path of svgData.paths) {
    // createShapes preserves the counterforms / holes inside the approved SVG.
    const shapes = SVGLoader.createShapes(path);
    for (const shape of shapes) {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrusionDepth / scale,
        steps: 1,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.035 / scale,
        bevelSize: 0.032 / scale,
        bevelSegments: 3
      });
      // SVG has a downward Y axis; flip that axis to match the 3D scene.
      // Center the full approved outline, including its circular star emblem.
      geometry.translate(-svgWidth / 2, -svgHeight / 2, -extrusionDepth / (2 * scale));
      geometry.scale(scale, -scale, scale);
      geometry.computeVertexNormals();
      const part = new THREE.Mesh(geometry, [faceMat, sideMat]);
      logo.add(part);
    }
  }

  // Use the source artwork itself when WebGL is unavailable.
  fallback.replaceChildren();
  const fallbackLogo = document.createElement('img');
  fallbackLogo.src = '/astro-logo.svg';
  fallbackLogo.alt = 'Astro Shapes logo';
  fallbackLogo.className = 'fallback-logo';
  fallback.appendChild(fallbackLogo);

  logo.rotation.set(-0.10, -0.26, -0.035);
  let targetRotX = logo.rotation.x;
  let targetRotY = logo.rotation.y;
  let targetZoom = 20;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let interacted = false;

  function resize() {
    const w = Math.max(wrap.clientWidth, 1);
    const h = Math.max(wrap.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 26 : w < 1050 ? 23 : 20;
    targetZoom = camera.position.z;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('pointerdown', ev => {
    dragging = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
    interacted = true;
    hint.style.opacity = '0';
  });
  canvas.addEventListener('pointermove', ev => {
    if (!dragging) return;
    targetRotY += (ev.clientX - lastX) * 0.007;
    targetRotX += (ev.clientY - lastY) * 0.004;
    targetRotX = THREE.MathUtils.clamp(targetRotX, -0.52, 0.52);
    lastX = ev.clientX;
    lastY = ev.clientY;
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('wheel', ev => {
    ev.preventDefault();
    targetZoom = THREE.MathUtils.clamp(targetZoom + ev.deltaY * 0.012, 13, 32);
    interacted = true;
    hint.style.opacity = '0';
  }, { passive: false });

  const options = document.querySelectorAll('.finish-choice');
  let finishName = 'aluminum';
  let colorTarget = new THREE.Color(finishes.aluminum.color);
  let sideTarget = new THREE.Color(0x989ea8);
  function changeFinish(name) {
    finishName = name;
    const finish = finishes[name];
    colorTarget = new THREE.Color(finish.color);
    sideTarget = new THREE.Color(finish.color).multiplyScalar(name === 'black' ? 0.68 : 0.78);
    faceMat.roughness = finish.roughness;
    sideMat.roughness = finish.roughness + 0.07;
    faceMat.envMapIntensity = finish.envMapIntensity;
    sideMat.envMapIntensity = finish.envMapIntensity;
    options.forEach(btn => {
      const selected = btn.dataset.finish === name;
      btn.classList.toggle('selected', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
  }
  options.forEach(btn => btn.addEventListener('click', () => changeFinish(btn.dataset.finish)));

  const clock = new THREE.Clock();
  let frame;
  function tick() {
    frame = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    if (!dragging && !interacted) targetRotY = -0.27 + Math.sin(t * 0.32) * 0.105;
    logo.rotation.x = THREE.MathUtils.lerp(logo.rotation.x, targetRotX, 0.07);
    logo.rotation.y = THREE.MathUtils.lerp(logo.rotation.y, targetRotY, 0.07);
    logo.position.y = Math.sin(t * 0.72) * 0.075;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZoom, 0.085);
    faceMat.color.lerp(colorTarget, 0.08);
    sideMat.color.lerp(sideTarget, 0.08);
    renderer.render(scene, camera);
  }
  tick();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else { clock.getDelta(); tick(); }
  });
} catch (error) {
  console.error('WebGL unavailable:', error);
  canvas.style.display = 'none';
  fallback.hidden = false;
  hint.style.display = 'none';
}
