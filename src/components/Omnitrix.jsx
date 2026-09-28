import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';




class OmnitrixAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playDialTick() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, t);
    filter.Q.setValueAtTime(3, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playPopUp() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    
    // Low mechanical whoosh
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(160, t);
    osc1.frequency.exponentialRampToValueAtTime(480, t + 0.28);
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.33);

    // High mechanical alien latch click
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(800, t + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(1600, t + 0.28);
    gain2.gain.setValueAtTime(0.12, t + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.18);
    osc2.stop(t + 0.36);
  }

  playTransformationSlam() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    // Sub-bass impact
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(180, t);
    sub.frequency.exponentialRampToValueAtTime(32, t + 0.7);
    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.85);

    // Energy laser chirp / alien surge
    const chirp = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    chirp.type = 'sawtooth';
    chirp.frequency.setValueAtTime(2600, t);
    chirp.frequency.exponentialRampToValueAtTime(140, t + 0.45);
    chirpGain.gain.setValueAtTime(0.35, t);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    chirp.connect(chirpGain);
    chirpGain.connect(this.ctx.destination);
    chirp.start(t);
    chirp.stop(t + 0.52);

    // Sci-fi high frequency plasma explosion
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3400, t);
    noiseFilter.Q.setValueAtTime(2.5, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(t);
    whiteNoise.stop(t + 0.42);
  }

  playAlarmBeep() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }
}

const audioFX = new OmnitrixAudioEngine();

const DialPlasmaShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorMode: { value: 0.0 }, // 0: Green, 1: Red (Timeout/Albedo), 2: Yellow/Orange (Self-Destruct)
    uIntensity: { value: 1.6 },
    uFlicker: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uColorMode;
    uniform float uIntensity;
    uniform float uFlicker;
    varying vec2 vUv;

    // Simplex/Perlin noise approximations
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Fractal Brownian Motion for turbulent filaments
    float fbm(vec2 p) {
      float f = 0.0;
      float w = 0.5;
      for (int i = 0; i < 5; i++) {
        f += w * snoise(p);
        p *= 2.12;
        w *= 0.5;
      }
      return f;
    }

    // Voronoi/cellular pattern for plasma webs
    float voronoi(vec2 p) {
      vec2 n = floor(p);
      vec2 f = fract(p);
      float md = 5.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j));
          vec2 o = mod289(n + g) * 0.15;
          vec2 r = g - f + sin(o * 6.28 + uTime * 2.5) * 0.5;
          float d = dot(r, r);
          if (d < md) md = d;
        }
      }
      return sqrt(md);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);

      // Discard outside unit circle
      if (r > 1.0) discard;

      // Hourglass Mask Formula: 
      // Ben 10 emblem has top and bottom triangles/cones opening outwards.
      // Left and right regions are solid black brackets.
      float angle = abs(atan(uv.x, uv.y)); // Angle from vertical axis (0 to PI)
      float coneAngle = 0.82; // roughly ~47 degrees cone
      
      // Determine if pixel is inside hourglass or flanking wings
      bool isHourglass = (angle < coneAngle) || (angle > (3.14159 - coneAngle));
      // Pinch center slightly for genuine Omnitrix curvature
      if (abs(uv.y) < 0.12 && abs(uv.x) > 0.08) {
        isHourglass = false;
      }

      if (!isHourglass) {
        // Black flanking casing inside dial with subtle metallic carbon sheen
        vec3 darkShield = vec3(0.04, 0.04, 0.04);
        float edgeGlow = smoothstep(0.0, 0.06, min(abs(angle - coneAngle), abs(angle - (3.14159 - coneAngle))));
        gl_FragColor = vec4(darkShield * (1.0 - edgeGlow * 0.4), 1.0);
        return;
      }

      // Inside Hourglass: Generate crackling lightning nebula plasma
      vec2 p = uv * 3.8;
      float t = uTime * 1.8;
      
      float n1 = fbm(p + vec2(t * 0.4, -t * 0.3));
      float n2 = fbm(p * 2.2 - vec2(n1 * 1.5, t * 0.7));
      float v = voronoi(p * 2.0 + vec2(n2 * 0.8, t * 0.5));

      // Electric lightning vein effect
      float lightning = abs(n2);
      lightning = pow(0.09 / (lightning + 0.04), 1.4);

      // Organic electric cell filament web
      float web = pow(1.0 - v, 3.2) * 2.4;

      // Deep energy core glow
      float centerGlow = (1.0 - r * 0.85);

      float energy = (lightning * 0.6 + web * 0.7 + centerGlow * 0.9 + n1 * 0.3) * uIntensity * uFlicker;

      // Color scheme selection
      vec3 coreColor;
      vec3 rimColor;

      if (uColorMode < 0.5) {
        // Classic Ben 10 Neon Omnitrix Green
        coreColor = vec3(0.85, 1.0, 0.5);
        rimColor  = vec3(0.1, 0.95, 0.15);
      } else if (uColorMode < 1.5) {
        // Albedo / Timeout Red
        coreColor = vec3(1.0, 0.8, 0.7);
        rimColor  = vec3(1.0, 0.05, 0.1);
      } else {
        // Self-Destruct Orange / Yellow
        coreColor = vec3(1.0, 0.95, 0.6);
        rimColor  = vec3(1.0, 0.45, 0.0);
      }

      vec3 finalColor = mix(rimColor, coreColor, clamp(energy * 0.5, 0.0, 1.0)) * energy;
      
      // Intense hot white core where lightning peaks
      if (energy > 2.2) {
        finalColor += vec3(0.7, 0.8, 0.7) * (energy - 2.2);
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

function createDakshBadgeTexture(text = "Daksh", theme = "green") {
  const THREE = window.THREE;
  if (!THREE) return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background deep dark green / carbon texture
  ctx.fillStyle = '#061309';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle carbon-fiber crosshatch
  ctx.strokeStyle = '#0c2211';
  ctx.lineWidth = 2;
  for (let x = 0; x < canvas.width; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 256, 256);
    ctx.stroke();
  }

  // Futuristic tech borders
  ctx.strokeStyle = theme === 'red' ? '#ff3344' : theme === 'orange' ? '#ff8800' : '#2aff4b';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

  // Inner glow line
  ctx.strokeStyle = theme === 'red' ? 'rgba(255, 50, 70, 0.4)' : 'rgba(42, 255, 75, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  // Glowing Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 120px "Montserrat", "Segoe UI", sans-serif';

  // Text shadow / bloom
  ctx.shadowColor = theme === 'red' ? '#ff2233' : theme === 'orange' ? '#ffa500' : '#39ff14';
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

  // Second pass for razor sharp white core
  ctx.shadowBlur = 8;
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createAlienHologram(alienIndex, themeColor = 0x39ff14) {
  const THREE = window.THREE;
  if (!THREE) return new (window.THREE?.Group || Object)();
  const group = new THREE.Group();

  // Outer rotating holographic scan rings
  const ringGeo = new THREE.RingGeometry(1.6, 1.7, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: themeColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
    wireframe: true
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  group.add(ringMesh);

  // Secondary fine particle ring
  const particleCount = 140;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const rad = 1.65 + (Math.random() - 0.5) * 0.2;
    pPositions[i * 3] = Math.cos(angle) * rad;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
    pPositions[i * 3 + 2] = Math.sin(angle) * rad;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: themeColor,
    size: 0.05,
    transparent: true,
    opacity: 0.85
  });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  // Stylized 3D Holo Silhouette tailored to each Alien archetype
  const holoMat = new THREE.MeshStandardMaterial({
    color: themeColor,
    emissive: themeColor,
    emissiveIntensity: 1.5,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });

  const bodyGroup = new THREE.Group();

  switch (alienIndex) {
    case 0: { // Heatblast (Flame crown & torso)
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 8), holoMat);
      head.position.y = 1.3;
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.25, 0.8, 8), holoMat);
      torso.position.y = 0.7;
      const limbsL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), holoMat);
      limbsL.position.set(-0.6, 0.6, 0);
      limbsL.rotation.z = 0.4;
      const limbsR = limbsL.clone();
      limbsR.position.x = 0.6;
      limbsR.rotation.z = -0.4;
      bodyGroup.add(head, torso, limbsL, limbsR);
      break;
    }
    case 1: { // Swampfire (Floral tendrils, flaming hands)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), holoMat);
      head.position.y = 1.35;
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.9, 7), holoMat);
      torso.position.y = 0.75;
      const horns = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 6, 12, Math.PI), holoMat);
      horns.rotation.z = Math.PI;
      horns.position.y = 1.5;
      bodyGroup.add(head, torso, horns);
      break;
    }
    case 2: { // Diamondhead (Angular shards & rear spikes)
      const torso = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), holoMat);
      torso.position.y = 0.8;
      const spike1 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.8, 5), holoMat);
      spike1.position.set(-0.35, 1.2, -0.2);
      spike1.rotation.z = 0.4;
      const spike2 = spike1.clone();
      spike2.position.x = 0.35;
      spike2.rotation.z = -0.4;
      bodyGroup.add(torso, spike1, spike2);
      break;
    }
    case 3: { // XLR8 (Streamlined aerodynamic helmet & roller tail)
      const coneHead = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.1, 7), holoMat);
      coneHead.rotation.x = -1.1;
      coneHead.position.set(0, 1.1, -0.2);
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.7, 6), holoMat);
      torso.position.set(0, 0.6, 0);
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, 0.9, 5), holoMat);
      tail.position.set(0, 0.3, -0.4);
      tail.rotation.x = 1.2;
      bodyGroup.add(coneHead, torso, tail);
      break;
    }
    case 4: { // Humungousaur (Massive hulking shoulders & tail)
      const torso = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75), holoMat);
      torso.position.y = 0.8;
      const shouldersL = new THREE.Mesh(new THREE.SphereGeometry(0.4, 6, 6), holoMat);
      shouldersL.position.set(-0.8, 0.95, 0);
      const shouldersR = shouldersL.clone();
      shouldersR.position.x = 0.8;
      bodyGroup.add(torso, shouldersL, shouldersR);
      break;
    }
    case 5: { // Alien X (Cosmic trident horns & regal stature)
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.22, 1.0, 8), holoMat);
      torso.position.y = 0.8;
      const hornMid = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.55, 5), holoMat);
      hornMid.position.y = 1.55;
      const hornL = hornMid.clone();
      hornL.position.set(-0.25, 1.45, 0);
      hornL.rotation.z = 0.35;
      const hornR = hornMid.clone();
      hornR.position.set(0.25, 1.45, 0);
      hornR.rotation.z = -0.35;
      bodyGroup.add(torso, hornMid, hornL, hornR);
      break;
    }
    case 6: { // Echo Echo (Small speaker head & sonic resonance rings)
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), holoMat);
      head.position.y = 0.95;
      const wave1 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 6, 24), holoMat);
      wave1.position.y = 0.95;
      const wave2 = wave1.clone();
      wave2.scale.set(1.3, 1.3, 1.3);
      bodyGroup.add(head, wave1, wave2);
      break;
    }
    default:
      break;
  }

  group.add(bodyGroup);
  group.position.y = 0.2;
  return group;
}

function Omnitrix() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  // 3D Model object references for animation
  const omnitrixRootRef = useRef(null);
  const coreBezelGroupRef = useRef(null);
  const dialPlasmaMeshRef = useRef(null);
  const badgeMeshRef = useRef(null);
  const sideButtonsRef = useRef({ left: null, right: null });
  const hologramGroupRef = useRef(null);
  const plasmaMaterialRef = useRef(null);
  const pointLightCenterRef = useRef(null);

  // Application State
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [userName, setUserName] = useState('Daksh');
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentAlienIndex, setCurrentAlienIndex] = useState(0);
  const [isActivated, setIsActivated] = useState(false); // Omnitrix popup mode
  const [isTransformed, setIsTransformed] = useState(false); // Slammed down
  const [activeMode, setActiveMode] = useState('active'); // 'active' (green), 'timeout' (red), 'selfdestruct' (orange/yellow), 'albedo' (crimson)
  const [isMuted, setIsMuted] = useState(false);
  const [cameraView, setCameraView] = useState('front'); // 'front', 'hero', 'macro', 'top'

  useEffect(() => {
    // Use the project's installed packages instead of relying on external CDN scripts.
    // The rest of this component uses these globals in its existing Three.js helpers.
    window.THREE = THREE;
    window.gsap = gsap;
    setScriptsLoaded(true);
  }, []);

  // Sync mute state to audio engine
  useEffect(() => {
    audioFX.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!scriptsLoaded || !containerRef.current) return;
    const THREE = window.THREE;
    if (!THREE) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050806);
    scene.fog = new THREE.FogExp2(0x050806, 0.08);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5); // Directly front-facing matching reference
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting setup for studio watch photo aesthetics
    const ambientLight = new THREE.AmbientLight(0x0a1a0f, 1.8);
    scene.add(ambientLight);

    // Key green rim light from top
    const topKeyLight = new THREE.DirectionalLight(0x2aff4b, 3.2);
    topKeyLight.position.set(0, 7, 3);
    scene.add(topKeyLight);

    // Warm specular filler for metallic bevels
    const sideFillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sideFillLight.position.set(6, -2, 5);
    scene.add(sideFillLight);

    const backRimLight = new THREE.DirectionalLight(0x187a32, 2.8);
    backRimLight.position.set(-5, 4, -4);
    scene.add(backRimLight);

    // Core point light inside the dial that blooms the watch
    const corePointLight = new THREE.PointLight(0x39ff14, 4.5, 6.0);
    corePointLight.position.set(0, 0, 0.6);
    scene.add(corePointLight);
    pointLightCenterRef.current = corePointLight;

    // --- Master Omnitrix Group ---
    const omnitrixRoot = new THREE.Group();
    omnitrixRootRef.current = omnitrixRoot;
    scene.add(omnitrixRoot);

    // Emerald Green metallic chassis material
    const emeraldMetalMat = new THREE.MeshStandardMaterial({
      color: 0x0f852b,
      roughness: 0.28,
      metalness: 0.82,
      envMapIntensity: 1.2
    });

    // Dark forest green / armor matte material
    const forestArmorMat = new THREE.MeshStandardMaterial({
      color: 0x064d17,
      roughness: 0.42,
      metalness: 0.6
    });

    // Matte dark gunmetal / black rubber strap material
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x121413,
      roughness: 0.55,
      metalness: 0.4
    });

    // Chrome silver for knurled dial pushers
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8e0d9,
      roughness: 0.2,
      metalness: 0.95
    });

    // Bezel dark rim
    const darkBezelMat = new THREE.MeshStandardMaterial({
      color: 0x1c211e,
      roughness: 0.35,
      metalness: 0.7
    });

    // Curved Wrist Band (cylindrical curve matching watch strap)
    const strapCurveGeo = new THREE.CylinderGeometry(3.3, 3.3, 10.0, 36, 1, true, -Math.PI / 1.5, Math.PI / 1.5);
    const strapMesh = new THREE.Mesh(strapCurveGeo, darkChassisMat);
    strapMesh.rotation.z = Math.PI / 2;
    strapMesh.position.set(0, 0, -2.9);
    omnitrixRoot.add(strapMesh);

    // Watch base chassis (sculpted curved cradle)
    const chassisGeo = new THREE.CylinderGeometry(2.8, 2.9, 0.75, 48);
    const chassisMesh = new THREE.Mesh(chassisGeo, forestArmorMat);
    chassisMesh.rotation.x = Math.PI / 2;
    omnitrixRoot.add(chassisMesh);

    // Top Hood Mount (features the "Daksh" nameplate badge)
    const topHoodGeo = new THREE.BoxGeometry(2.7, 1.45, 0.85);
    const topHoodMesh = new THREE.Mesh(topHoodGeo, emeraldMetalMat);
    topHoodMesh.position.set(0, 2.3, -0.05);
    // Slight angled incline matching the reference image hood
    topHoodMesh.rotation.x = 0.22;
    omnitrixRoot.add(topHoodMesh);

    // Custom Name Badge Plane on the Top Hood
    const badgeTexture = createDakshBadgeTexture(userName, 'green');
    const badgeGeo = new THREE.PlaneGeometry(2.1, 0.62);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: badgeTexture,
      transparent: true
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 2.36, 0.39);
    badgeMesh.rotation.x = 0.22;
    omnitrixRoot.add(badgeMesh);
    badgeMeshRef.current = badgeMesh;

    // Bottom Hood Mount
    const botHoodGeo = new THREE.BoxGeometry(2.7, 1.35, 0.85);
    const botHoodMesh = new THREE.Mesh(botHoodGeo, emeraldMetalMat);
    botHoodMesh.position.set(0, -2.3, -0.05);
    botHoodMesh.rotation.x = -0.22;
    omnitrixRoot.add(botHoodMesh);

    // Sculpted Green Wing Horns flanking the circular bezel (Left & Right)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(0.9, 1.6);
    wingShape.lineTo(0.5, 2.3);
    wingShape.lineTo(-0.2, 2.0);
    wingShape.closePath();
    const extrudeSettings = { depth: 0.65, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

    const leftWing = new THREE.Mesh(wingGeo, emeraldMetalMat);
    leftWing.position.set(-2.55, -1.1, -0.3);
    leftWing.rotation.z = 0.15;
    omnitrixRoot.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, emeraldMetalMat);
    rightWing.position.set(2.55, -1.1, -0.3);
    rightWing.rotation.y = Math.PI;
    rightWing.rotation.z = -0.15;
    omnitrixRoot.add(rightWing);

    // Core Bezel Group (Pops UP when activated and rotates with alien selector)
    const coreBezelGroup = new THREE.Group();
    coreBezelGroup.position.z = 0.35;
    omnitrixRoot.add(coreBezelGroup);
    coreBezelGroupRef.current = coreBezelGroup;

    // Outer Dark Segmented Bezel Ring with crosshair seam indents
    const outerRingGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.42, 64);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, darkBezelMat);
    outerRingMesh.rotation.x = Math.PI / 2;
    coreBezelGroup.add(outerRingMesh);

    // Bezel Inner Bevel (Emerald Metallic rim)
    const innerRimGeo = new THREE.TorusGeometry(2.28, 0.12, 16, 64);
    const innerRimMesh = new THREE.Mesh(innerRimGeo, emeraldMetalMat);
    innerRimMesh.position.z = 0.22;
    coreBezelGroup.add(innerRimMesh);

    // Cross seams/indicators on bezel (4 tick points at 12, 3, 6, 9 o'clock)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const seamGeo = new THREE.BoxGeometry(0.12, 0.45, 0.08);
      const seamMesh = new THREE.Mesh(seamGeo, chromeMat);
      seamMesh.position.set(Math.sin(angle) * 2.38, Math.cos(angle) * 2.38, 0.22);
      seamMesh.rotation.z = -angle;
      coreBezelGroup.add(seamMesh);
    }

    // Side cylindrical pushers / Dial knob (Right & Left)
    const pusherGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.8, 24);
    const rightPusher = new THREE.Mesh(pusherGeo, chromeMat);
    rightPusher.rotation.z = Math.PI / 2;
    rightPusher.position.set(2.8, 0.1, 0.1);
    omnitrixRoot.add(rightPusher);

    const leftPusher = new THREE.Mesh(pusherGeo, darkChassisMat);
    leftPusher.rotation.z = Math.PI / 2;
    leftPusher.position.set(-2.7, 0.1, 0.1);
    omnitrixRoot.add(leftPusher);
    sideButtonsRef.current = { left: leftPusher, right: rightPusher };

    // Dial Plasma Hourglass Custom Shader Mesh
    const plasmaMat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(DialPlasmaShader.uniforms),
      vertexShader: DialPlasmaShader.vertexShader,
      fragmentShader: DialPlasmaShader.fragmentShader,
      side: THREE.DoubleSide
    });
    plasmaMaterialRef.current = plasmaMat;

    const dialCircleGeo = new THREE.CircleGeometry(1.85, 64);
    const dialPlasmaMesh = new THREE.Mesh(dialCircleGeo, plasmaMat);
    dialPlasmaMesh.position.z = 0.22;
    coreBezelGroup.add(dialPlasmaMesh);
    dialPlasmaMeshRef.current = dialPlasmaMesh;

    // Reflective Lens / Glass Dome over the dial
    const lensGeo = new THREE.SphereGeometry(1.9, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.25);
    const lensMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.6,
      ior: 1.52,
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      reflectivity: 0.9
    });
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.position.z = 0.08;
    coreBezelGroup.add(lensMesh);

    // Group for projected 3D Alien Hologram (Floats above when popped open)
    const holoGroup = new THREE.Group();
    holoGroup.position.set(0, 0, 1.2);
    holoGroup.scale.set(0.001, 0.001, 0.001); // hidden initially
    coreBezelGroup.add(holoGroup);
    hologramGroupRef.current = holoGroup;

    // Ambient floating dust particles around watch
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustCoords = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustCoords[i] = (Math.random() - 0.5) * 12;
      dustCoords[i + 1] = (Math.random() - 0.5) * 10;
      dustCoords[i + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustCoords, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x39ff14,
      size: 0.04,
      transparent: true,
      opacity: 0.45
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = normX * 0.25;
      targetRotX = -normY * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update Custom Plasma Shader uniforms
      if (plasmaMaterialRef.current) {
        plasmaMaterialRef.current.uniforms.uTime.value = elapsedTime;
        // subtle voltage oscillation
        plasmaMaterialRef.current.uniforms.uFlicker.value = 0.95 + Math.sin(elapsedTime * 18.0) * 0.05;
      }

      // Smooth mouse tilt parallax
      if (omnitrixRootRef.current) {
        omnitrixRootRef.current.rotation.y += (targetRotY - omnitrixRootRef.current.rotation.y) * 0.06;
        omnitrixRootRef.current.rotation.x += (targetRotX - omnitrixRootRef.current.rotation.x) * 0.06;
      }

      // Slowly rotate alien hologram and dust
      if (hologramGroupRef.current) {
        hologramGroupRef.current.rotation.z += 0.012;
      }
      dustPoints.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [scriptsLoaded]);

  useEffect(() => {
    if (!badgeMeshRef.current || !scriptsLoaded) return;
    const theme = activeMode === 'timeout' || activeMode === 'albedo' ? 'red' : activeMode === 'selfdestruct' ? 'orange' : 'green';
    const newTex = createDakshBadgeTexture(userName, theme);
    if (newTex) {
      badgeMeshRef.current.material.map = newTex;
      badgeMeshRef.current.material.needsUpdate = true;
    }
  }, [userName, activeMode, scriptsLoaded]);

  useEffect(() => {
    if (!plasmaMaterialRef.current || !pointLightCenterRef.current) return;
    const uniforms = plasmaMaterialRef.current.uniforms;

    if (activeMode === 'active') {
      uniforms.uColorMode.value = 0.0;
      pointLightCenterRef.current.color.setHex(0x39ff14);
    } else if (activeMode === 'timeout' || activeMode === 'albedo') {
      uniforms.uColorMode.value = 1.0;
      pointLightCenterRef.current.color.setHex(0xff182e);
    } else if (activeMode === 'selfdestruct') {
      uniforms.uColorMode.value = 2.0;
      pointLightCenterRef.current.color.setHex(0xff7700);
      audioFX.playAlarmBeep();
    }
  }, [activeMode]);

  const updateHologramAlien = useCallback((index) => {
    if (!hologramGroupRef.current || !window.THREE) return;
    const holo = hologramGroupRef.current;
    
    // Clear previous hologram mesh
    while (holo.children.length > 0) {
      const obj = holo.children[0];
      holo.remove(obj);
    }

    const themeHex = activeMode === 'timeout' || activeMode === 'albedo' 
      ? 0xff2a45 
      : activeMode === 'selfdestruct' 
      ? 0xff9900 
      : 0x39ff14;

    const newAlienMesh = createAlienHologram(index, themeHex);
    holo.add(newAlienMesh);
  }, [activeMode]);

  // Keep hologram updated when current alien index changes
  useEffect(() => {
    if (scriptsLoaded) {
      updateHologramAlien(currentAlienIndex);
    }
  }, [currentAlienIndex, updateHologramAlien, scriptsLoaded]);

  const toggleActivation = () => {
    if (!coreBezelGroupRef.current) return;
    const gsap = window.gsap;

    

      if (gsap) {
        // Bezel elevates outwards + button depresses
        gsap.to(coreBezelGroupRef.current.position, {
          z: 1.15,
          duration: 0.45,
          ease: 'back.out(2.2)'
        });

        // Side buttons nudge in
        if (sideButtonsRef.current.right) {
          gsap.to(sideButtonsRef.current.right.position, {
            x: 2.62,
            yoyo: true,
            repeat: 1,
            duration: 0.15
          });
        }

        // Grow & animate Hologram projection
        if (hologramGroupRef.current) {
          updateHologramAlien(currentAlienIndex);
          gsap.to(hologramGroupRef.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            delay: 0.15,
            ease: 'power3.out'
          });
          gsap.to(hologramGroupRef.current.position, {
            z: 2.4,
            duration: 0.5,
            delay: 0.15,
            ease: 'power3.out'
          });
        }

        // Intensify plasma core
        if (plasmaMaterialRef.current) {
          gsap.to(plasmaMaterialRef.current.uniforms.uIntensity, {
            value: 2.8,
            duration: 0.4
          });
        }
      } else {
        coreBezelGroupRef.current.position.z = 1.15;
      }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-[#040705]"
    />
  );
}


export default Omnitrix;