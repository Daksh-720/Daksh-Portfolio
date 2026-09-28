import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { 
  Volume2, VolumeX, RotateCw, Sparkles, ShieldAlert, 
  Zap, Eye, RefreshCw, Radio, Layers, ChevronLeft, ChevronRight, Sliders, Loader2
} from 'lucide-react';

const ALIENS = [
  {
    id: 'heatblast',
    name: 'Heatblast',
    species: 'Pyronite',
    planet: 'Pyros',
    power: 'Pyrokinesis & Terrakinesis',
    color: '#ff6600',
    description: 'A magma-based life form capable of projecting superheated fire blasts and flying via plasma propulsion.'
  },
  {
    id: 'swampfire',
    name: 'Swampfire',
    species: 'Methanosian',
    planet: 'Methanos',
    power: 'Chlorokinesis & Methane Fire',
    color: '#39ff14',
    description: 'Plant-like humanoid with extreme regenerative cells, methane projection, and plant manipulation.'
  },
  {
    id: 'diamondhead',
    name: 'Diamondhead',
    species: 'Petrosapien',
    planet: 'Petropia',
    power: 'Crystallokinesis & Density Control',
    color: '#00ffcc',
    description: 'Silicon-based crystal warrior capable of firing razor-sharp shards and constructing impenetrable crystalline shields.'
  },
  {
    id: 'xlr8',
    name: 'XLR8',
    species: 'Kineceleran',
    planet: 'Kinet',
    power: 'Hyperspeed & Friction Manipulation',
    color: '#00e5ff',
    description: 'Hyper-kinetic alien capable of exceeding 500 mph within fractions of a second, running on water and vertical surfaces.'
  },
  {
    id: 'humungousaur',
    name: 'Humungousaur',
    species: 'Vaxasaurian',
    planet: 'Terradino',
    power: 'Titan Strength & Size Alteration',
    color: '#d48832',
    description: 'Colossal bipedal saurian possessing immense brute strength and bone-armor density scaling up to 60 feet.'
  },
  {
    id: 'alienx',
    name: 'Alien X',
    species: 'Celestialsapien',
    planet: 'Forge of Creation',
    power: 'Omnipotence & Reality Warping',
    color: '#c084fc',
    description: 'Cosmic deity possessing reality-altering omnipotence, governed by Bellicus and Serena consciousness voices.'
  },
  {
    id: 'echoecho',
    name: 'Echo Echo',
    species: 'Sonorosian',
    planet: 'Sonorosia',
    power: 'Sonic Blasts & Self-Duplication',
    color: '#ffffff',
    description: 'Living sound waves encased in a silicon containment suit, generating ear-splitting sonic screams and endless clones.'
  }
];

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

    if (!isActivated) {
      // POP UP Omnitrix core
      audioFX.playPopUp();
      setIsActivated(true);
      setIsTransformed(false);

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
    } else {
      // SLAM DOWN / TRANSFORM
      slamDownTransformation();
    }
  };

  const slamDownTransformation = () => {
    if (!coreBezelGroupRef.current) return;
    const gsap = window.gsap;
    audioFX.playTransformationSlam();
    setIsActivated(false);
    setIsTransformed(true);

    if (gsap) {
      // Hide Hologram immediately
      if (hologramGroupRef.current) {
        gsap.to(hologramGroupRef.current.scale, {
          x: 0.001,
          y: 0.001,
          z: 0.001,
          duration: 0.15
        });
      }

      // Heavy slam back into watch chassis
      gsap.timeline()
        .to(coreBezelGroupRef.current.position, {
          z: 0.28,
          duration: 0.14,
          ease: 'power4.in'
        })
        .to(omnitrixRootRef.current.position, {
          z: -0.4,
          duration: 0.08,
          yoyo: true,
          repeat: 3,
          ease: 'sine.inOut'
        })
        .to(coreBezelGroupRef.current.position, {
          z: 0.35,
          duration: 0.2,
          ease: 'power2.out'
        });

      // Blinding plasma flash
      if (plasmaMaterialRef.current) {
        gsap.timeline()
          .to(plasmaMaterialRef.current.uniforms.uIntensity, {
            value: 6.0,
            duration: 0.1
          })
          .to(plasmaMaterialRef.current.uniforms.uIntensity, {
            value: 1.6,
            duration: 1.2,
            ease: 'power2.out'
          });
      }
    } else {
      coreBezelGroupRef.current.position.z = 0.35;
    }

    // Auto-reset transformation state after 6 seconds
    setTimeout(() => {
      setIsTransformed(false);
    }, 6000);
  };

  const cycleAlien = (direction) => {
    audioFX.playDialTick();
    const nextIndex = direction === 'next' 
      ? (currentAlienIndex + 1) % ALIENS.length 
      : (currentAlienIndex - 1 + ALIENS.length) % ALIENS.length;

    setCurrentAlienIndex(nextIndex);

    const gsap = window.gsap;

    // Bezel rotation snap
    if (coreBezelGroupRef.current && gsap) {
      const rotStep = (Math.PI * 2) / ALIENS.length;
      const targetAngle = coreBezelGroupRef.current.rotation.z + (direction === 'next' ? rotStep : -rotStep);
      
      gsap.to(coreBezelGroupRef.current.rotation, {
        z: targetAngle,
        duration: 0.32,
        ease: 'back.out(1.8)'
      });
    }

    // Hologram pop & switch
    if (hologramGroupRef.current && isActivated && gsap) {
      gsap.timeline()
        .to(hologramGroupRef.current.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
          duration: 0.12,
          onComplete: () => updateHologramAlien(nextIndex)
        })
        .to(hologramGroupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.28,
          ease: 'back.out(2.0)'
        });
    }
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > 25) {
      cycleAlien(e.deltaY > 0 ? 'next' : 'prev');
    }
  };

  const setCameraPreset = (preset) => {
    setCameraView(preset);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    const gsap = window.gsap;

    if (!gsap) return;

    switch (preset) {
      case 'front': // Exact Reference Framing
        gsap.to(cam.position, { x: 0, y: 0, z: 8.5, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(cam.rotation, { x: 0, y: 0, z: 0, duration: 1.2 });
        break;
      case 'hero': // Dynamic 45-degree angle
        gsap.to(cam.position, { x: 3.8, y: -2.8, z: 6.8, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(cam.rotation, { x: 0.35, y: 0.45, z: -0.15, duration: 1.2 });
        break;
      case 'macro': // Close-up of Daksh Badge and Glass Bezel
        gsap.to(cam.position, { x: 0, y: 0.6, z: 4.8, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(cam.rotation, { x: 0.08, y: 0, z: 0, duration: 1.2 });
        break;
      case 'top': // Direct Overhead Look
        gsap.to(cam.position, { x: 0, y: 0, z: 6.5, duration: 1.2, ease: 'power2.inOut' });
        gsap.to(cam.rotation, { x: 0, y: 0, z: 0, duration: 1.2 });
        break;
      default:
        break;
    }
  };

  const currentAlien = ALIENS[currentAlienIndex];

  return (
    <div 
      className="relative w-screen h-screen bg-[#040705] text-white font-sans overflow-hidden select-none"
      onWheel={handleWheel}
    >
      {/* 3D Canvas Mount Point */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay while CDN bundles initialize */}
      {!scriptsLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#040705] z-50">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
          <p className="font-mono text-emerald-300 text-sm tracking-widest uppercase animate-pulse">
            CALIBRATING OMNITRIX CORE...
          </p>
        </div>
      )}

      {/* Top HUD Bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-5 md:p-8 pointer-events-none">
        <div className="pointer-events-auto">
          <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-emerald-400/80">
            PERSONAL DEVICE INTERFACE
          </p>
          <h1 className="mt-2 text-xl md:text-3xl font-black tracking-[0.12em] text-white">
            DAKSH&apos;S <span className="text-emerald-400">OMNITRIX</span>
          </h1>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {isEditingName ? (
            <input
              autoFocus
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setIsEditingName(false);
              }}
              aria-label="Watch nameplate text"
              className="w-28 rounded-lg border border-emerald-500/40 bg-black/80 px-3 py-2 text-sm text-emerald-100 outline-none focus:border-emerald-300"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="rounded-xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-xs font-mono text-emerald-200 hover:bg-emerald-950/70"
              title="Edit watch nameplate"
            >
              NAME: {userName}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/90 border border-emerald-500/30 flex items-center justify-center text-emerald-300 backdrop-blur-md transition-colors"
            title={isMuted ? "Unmute Audio FX" : "Mute Audio FX"}
            aria-label={isMuted ? "Unmute audio effects" : "Mute audio effects"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {}
      {isTransformed && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
          <div className="px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-400 backdrop-blur-md text-emerald-300 font-mono text-sm tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(42,255,75,0.5)]">
            <Zap className="w-4 h-4 text-emerald-300 animate-spin" />
            <span>DNA ENGAGED: TRANSFORMED INTO {currentAlien.name.toUpperCase()}!</span>
          </div>
        </div>
      )}

      {}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-px h-6 bg-linear-to-b from-transparent to-emerald-400 animate-pulse" />
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-emerald-400/90 mt-1">
          SCROLL TO CYCLE ALIENS
        </span>
      </div>

      {}
      <div className="absolute left-4 md:left-8 bottom-8 md:bottom-12 max-w-xs md:max-w-sm pointer-events-auto z-20">
        <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                DNA STREAM #{currentAlienIndex + 1}/{ALIENS.length}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
                {currentAlien.name}
              </h2>
            </div>
            <div 
              className="w-4 h-4 rounded-full shadow-[0_0_12px]" 
              style={{ backgroundColor: currentAlien.color, shadowColor: currentAlien.color }} 
            />
          </div>

          <div className="space-y-1.5 text-xs font-mono text-emerald-200/80 mb-3">
            <div className="flex justify-between">
              <span className="text-emerald-500/70">SPECIES:</span>
              <span className="text-white">{currentAlien.species}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-500/70">ORIGIN:</span>
              <span className="text-white">{currentAlien.planet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-500/70">CORE ABILITY:</span>
              <span className="text-emerald-300 font-semibold">{currentAlien.power}</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-300/70 leading-relaxed font-sans line-clamp-2">
            {currentAlien.description}
          </p>

          {/* Quick Step Buttons */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-500/20">
            <button
              onClick={() => cycleAlien('prev')}
              className="flex-1 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> PREV
            </button>
            <button
              onClick={() => cycleAlien('next')}
              className="flex-1 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-800/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1 transition-all"
            >
              NEXT <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
        <button
          onClick={toggleActivation}
          className={`relative group px-8 py-3.5 rounded-2xl font-mono font-black text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-3 backdrop-blur-xl border ${
            isActivated
              ? 'bg-linear-to-r from-red-600 via-rose-500 to-amber-500 border-red-300 text-white shadow-[0_0_40px_rgba(255,50,50,0.7)] scale-105'
              : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-400/60 hover:border-emerald-300 text-emerald-300 shadow-[0_0_30px_rgba(42,255,75,0.3)]'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${isActivated ? 'animate-spin' : 'animate-pulse text-emerald-400'}`} />
          <span>{isActivated ? "SLAP TO TRANSFORM" : "ACTIVATE OMNITRIX"}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>

      {}
      <div className="absolute right-4 md:right-8 bottom-8 md:bottom-12 flex flex-col gap-3 pointer-events-auto z-20">
        {/* Camera Views */}
        <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-3 flex flex-col gap-1.5 shadow-[0_0_20px_rgba(0,0,0,0.7)]">
          <span className="text-[9px] font-mono uppercase text-emerald-400/80 px-1 font-bold">
            CAMERA VIEW
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'front', label: 'FRONT' },
              { id: 'hero', label: 'HERO 45°' },
              { id: 'macro', label: 'MACRO' },
              { id: 'top', label: 'TOP' },
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => setCameraPreset(cam.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                  cameraView === cam.id
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(42,255,75,0.4)]'
                    : 'bg-emerald-950/40 text-emerald-300/80 hover:bg-emerald-900/60'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Watch Mode Selector */}
        <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-3 flex flex-col gap-1.5 shadow-[0_0_20px_rgba(0,0,0,0.7)]">
          <span className="text-[9px] font-mono uppercase text-emerald-400/80 px-1 font-bold flex items-center justify-between">
            <span>OMNITRIX MODE</span>
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
          </span>
          <div className="flex flex-col gap-1">
            {[
              { id: 'active', label: 'NORMAL (GREEN)', color: 'text-emerald-400' },
              { id: 'timeout', label: 'RECHARGE (RED)', color: 'text-rose-400' },
              { id: 'selfdestruct', label: 'SELF-DESTRUCT (ORANGE)', color: 'text-amber-400' },
              { id: 'albedo', label: 'ALBEDO CORE (CRIMSON)', color: 'text-red-500' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono text-left transition-all ${
                  activeMode === mode.id
                    ? 'bg-emerald-500/20 border border-emerald-400 font-bold ' + mode.color
                    : 'bg-emerald-950/20 text-emerald-300/60 hover:bg-emerald-900/40'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Omnitrix;