import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

// A single-file, fully procedural Omnitrix. Drag to turn; tap the dial to raise/lower it;
// tap the small green button to change the selected glow.
export default function Omnitrix({ isVisible = true }) {
  const mount = useRef(null);
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    scene.backgroundColor = '#000000';
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(5.6, 4.4, 8.6);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.background = '#000000';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room);
    room.dispose();
    scene.environment = env.texture;
    scene.environmentIntensity = 1.15;
    scene.add(new THREE.HemisphereLight(0xe9f5eb, 0x25312a, 1.45));
    const key = new THREE.DirectionalLight(0xf5fff4, 2.3);
    key.position.set(-3, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -8; key.shadow.camera.right = 8;
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.0003;
    scene.add(key);
    const edge = new THREE.DirectionalLight(0xa0feba, 1.5);
    edge.position.set(4, 4, -5);
    scene.add(edge);
    const fill = new THREE.DirectionalLight(0xe1e9e5, 1.4);
    fill.position.set(6, -1, 5);
    scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x000000 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.04;
    ground.receiveShadow = true;
    scene.add(ground);

    const root = new THREE.Group();
    root.rotation.set(-0.04, -0.27, -0.07);
    scene.add(root);

    // Fine molded grain, not flat plastic. Bump is made locally so the model stays self-contained.
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = grainCanvas.height = 256;
    const grainContext = grainCanvas.getContext('2d');
    const grain = grainContext.createImageData(256, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const i = (y * 256 + x) * 4;
      const n = Math.sin(y * 0.7) * 7 + Math.sin(x * 0.19 + y * 0.38) * 5 + Math.random() * 14;
      grain.data[i] = grain.data[i + 1] = grain.data[i + 2] = 122 + n;
      grain.data[i + 3] = 255;
    }
    grainContext.putImageData(grain, 0, 0);
    const grainTexture = new THREE.CanvasTexture(grainCanvas);
    grainTexture.wrapS = grainTexture.wrapT = THREE.RepeatWrapping;
    grainTexture.repeat.set(3, 5);
    const rubber = new THREE.MeshPhysicalMaterial({ color: 0x0d1411, roughness: 0.7, metalness: 0.04, clearcoat: 0.13, clearcoatRoughness: 0.52, bumpMap: grainTexture, bumpScale: 0.018, side: THREE.DoubleSide });
    const innerRubber = new THREE.MeshStandardMaterial({ color: 0x0c100e, roughness: 0.87, side: THREE.DoubleSide });
    const panel = new THREE.MeshPhysicalMaterial({ color: 0x101d16, metalness: 0.63, roughness: 0.34, clearcoat: 0.48, clearcoatRoughness: 0.24, side: THREE.DoubleSide, bumpMap: grainTexture, bumpScale: 0.007 });
    const edgeBlack = new THREE.MeshStandardMaterial({ color: 0x080c09, metalness: 0.3, roughness: 0.49, side: THREE.DoubleSide });
    const titanium = new THREE.MeshStandardMaterial({ color: 0x82938b, metalness: 0.94, roughness: 0.29, side: THREE.DoubleSide });
    const silver = new THREE.MeshPhysicalMaterial({ color: 0xb8c8c0, metalness: 0.91, roughness: 0.22, clearcoat: 0.35, side: THREE.DoubleSide });
    const greenMetal = new THREE.MeshPhysicalMaterial({ color: 0x284c34, metalness: 0.82, roughness: 0.26, clearcoat: 0.62 });
    const blackMetal = new THREE.MeshStandardMaterial({ color: 0x18221c, metalness: 0.78, roughness: 0.29 });
    const gunmetal = new THREE.MeshStandardMaterial({ color: 0x32463a, metalness: 0.87, roughness: 0.37, side: THREE.DoubleSide });
    const inset = new THREE.MeshPhysicalMaterial({ color: 0x07100c, metalness: 0.43, roughness: 0.51, clearcoat: 0.34, bumpMap: grainTexture, bumpScale: 0.012, side: THREE.DoubleSide });
    const enamel = new THREE.MeshPhysicalMaterial({ color: 0x1b9b54, emissive: 0x14743b, emissiveIntensity: 0.31, metalness: 0.52, roughness: 0.23, clearcoat: 0.86, side: THREE.DoubleSide });
    const brushed = new THREE.MeshPhysicalMaterial({ color: 0x9aaea5, metalness: 0.88, roughness: 0.32, clearcoat: 0.26, side: THREE.DoubleSide });
    const light = new THREE.MeshPhysicalMaterial({ color: 0x9dfc63, emissive: 0x65ed39, emissiveIntensity: 0.65, roughness: 0.2, metalness: 0.12, clearcoat: 1 });
    const faceGreen = new THREE.MeshPhysicalMaterial({ color: 0x7fea69, emissive: 0x379d27, emissiveIntensity: 0.42, metalness: 0.14, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 });
    const faceBlack = new THREE.MeshPhysicalMaterial({ color: 0x030906, metalness: 0.15, roughness: 0.5, clearcoat: 0.35, side: THREE.DoubleSide });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xc5eac9, metalness: 0.05, roughness: 0.08, transmission: 0.3, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.055, depthWrite: false });
    const materials = [rubber, innerRubber, panel, edgeBlack, titanium, silver, greenMetal, blackMetal, gunmetal, inset, enamel, brushed, light, faceGreen, faceBlack, glass];

    // A proper thick, open cuff: x runs across the wrist, theta wraps around it.
    // Four stitched surfaces and closed ends make the band solid from every angle.
    function cuffPoint(theta, x, radius) {
      return new THREE.Vector3(x, radius * Math.cos(theta), radius * Math.sin(theta));
    }
    function bandGeometry(radius, xSide, reverse = false) {
      const verts = [], indices = [], uvs = [];
      const N = 80, M = 20;
      for (let i = 0; i <= N; i++) {
        const theta = -2.63 + i * 5.26 / N;
        const taper = 1 - 0.24 * Math.pow(Math.abs(theta) / 2.63, 2.7);
        for (let j = 0; j <= M; j++) {
          const x = (j / M * 2 - 1) * xSide * taper;
          const p = cuffPoint(theta, x, radius);
          verts.push(p.x, p.y, p.z); uvs.push(j / M, i / N);
        }
      }
      for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
        const a = i * (M + 1) + j, b = a + M + 1;
        if (reverse) indices.push(a, a + 1, b, a + 1, b + 1, b);
        else indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices); geo.computeVertexNormals();
      return geo;
    }
    function ribbon(points, width, radius, mat, parent = root) {
      const verts = [], ids = [];
      points.forEach(([x, theta], i) => {
        const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
        const dx = b[0] - a[0], dt = b[1] - a[1];
        const len = Math.hypot(dx, dt * radius) || 1;
        const nx = -dt * radius / len, nt = dx / len / radius;
        const w = typeof width === 'function' ? width(i / (points.length - 1)) : width;
        for (const sign of [-1, 1]) {
          const p = cuffPoint(theta + nt * w * sign / 2, x + nx * w * sign / 2, radius);
          verts.push(p.x, p.y, p.z);
        }
        if (i) { const k = i * 2; ids.push(k - 2, k - 1, k, k - 1, k + 1, k); }
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setIndex(ids); geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat); parent.add(mesh); return mesh;
    }
    function addMesh(geo, mat, parent = root, pos = [0, 0, 0], rot = [0, 0, 0]) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos); mesh.rotation.set(...rot);
      mesh.castShadow = true; mesh.receiveShadow = true;
      parent.add(mesh); return mesh;
    }

    addMesh(bandGeometry(1.62, 2.05), rubber);
    addMesh(bandGeometry(1.34, 2.05, true), innerRubber);
    // Wrap edge piping along both sides and along both trimmed cuff ends.
    for (const s of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 80; i++) {
        const t = -2.63 + i * 5.26 / 80;
        pts.push(cuffPoint(t, s * 2.05 * (1 - 0.24 * Math.pow(Math.abs(t) / 2.63, 2.7)), 1.49));
      }
      addMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.055, 7, false), edgeBlack);
      for (const radius of [1.34, 1.62]) {
        const seam = [];
        for (let i = 0; i <= 25; i++) seam.push(cuffPoint(s * 2.63, (i / 25 * 2 - 1) * 1.56, radius));
        addMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(seam), 25, 0.045, 7, false), edgeBlack);
      }
    }
    // End caps fill the thickness so there are no paper-thin open edges.
    for (const t of [-2.63, 2.63]) {
      const v = [], ids = [];
      for (let i = 0; i <= 20; i++) {
        const x = (i / 20 * 2 - 1) * 1.56;
        for (const r of [1.34, 1.62]) { const p = cuffPoint(t, x, r); v.push(p.x, p.y, p.z); }
        if (i) { const k = i * 2; ids.push(k - 2, k, k - 1, k - 1, k, k + 1); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.setIndex(ids); g.computeVertexNormals();
      addMesh(g, rubber);
    }

    // Form-fitted raised armour panels, following the same curvature as the cuff.
    for (const side of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 32; i++) {
        const t = -2.2 + i * 4.4 / 32;
        pts.push([side * (1.2 + 0.1 * Math.cos(t)), t]);
      }
      ribbon(pts, (u) => 0.64 - 0.24 * Math.pow(Math.abs(u - 0.5) * 2, 2), 1.636, panel);
      // Seam parallel to the silver accent.
      ribbon(pts.map(([x, t]) => [x - side * 0.39, t]), 0.025, 1.645, edgeBlack);
      // Molded ribs and a narrow green enamel channel follow the curved bracelet.
      for (let i = -8; i <= 8; i++) {
        const t = i * 0.235;
        ribbon([[side * 1.43, t], [side * 1.72, t]], 0.028, 1.649, gunmetal);
      }
      ribbon(pts.map(([x, t]) => [x + side * 0.30, t]), 0.045, 1.648, greenMetal);
    }
    // Body armour: the reference has a deep, divided black center, not a flat sleeve.
    // Stacked curved layers create visible molded borders around each green inlay.
    const centerArc = [[0, 0.66], [0, 0.87], [0, 1.12], [0, 1.40], [0, 1.72], [0, 2.03], [0, 2.31]];
    ribbon(centerArc, u => 1.52 - 0.32 * Math.abs(u - 0.5), 1.641, edgeBlack);
    ribbon(centerArc, u => 1.37 - 0.33 * Math.abs(u - 0.5), 1.655, gunmetal);
    ribbon(centerArc, u => 1.21 - 0.31 * Math.abs(u - 0.5), 1.665, inset);
    for (const side of [-1, 1]) {
      const edgePath = centerArc.map(([x, t]) => [x + side * (0.66 - 0.17 * Math.abs((t - 1.47) / 0.85)), t]);
      ribbon(edgePath, 0.046, 1.672, enamel);
      // Outer green structural spine follows the band underneath the silver sweep.
      ribbon([[side * 1.76, 0.44], [side * 1.78, 0.85], [side * 1.73, 1.30], [side * 1.66, 1.77], [side * 1.47, 2.12]], 0.12, 1.655, greenMetal);
      ribbon([[side * 1.76, 0.44], [side * 1.78, 0.85], [side * 1.73, 1.30], [side * 1.66, 1.77], [side * 1.47, 2.12]], 0.027, 1.666, enamel);
      const back = [[side * 1.76, -0.44], [side * 1.78, -0.85], [side * 1.73, -1.30], [side * 1.66, -1.77], [side * 1.47, -2.12]];
      ribbon(back, 0.12, 1.655, greenMetal);
      ribbon(back, 0.027, 1.666, enamel);
    }

    // Layered arrow-shaped enamel pockets down the face of the bracelet.
    const armorPanels = [
      { t: 0.97, width: 0.45 },
      { t: 1.38, width: 0.61 },
      { t: 1.81, width: 0.48 },
      { t: 2.20, width: 0.37 },
    ];
    armorPanels.forEach(({ t, width }, i) => {
      const outline = [[-width, t - 0.125], [0, t - 0.075], [width, t - 0.125], [width * 0.73, t + 0.13], [0, t + 0.20], [-width * 0.73, t + 0.13], [-width, t - 0.125]];
      ribbon(outline, 0.045, 1.679, blackMetal);
      ribbon([[0, t - 0.056], [0, t + 0.115]], i === 1 ? 0.24 : 0.16, 1.681, greenMetal);
      ribbon([[0, t - 0.02], [0, t + 0.08]], 0.038, 1.686, enamel);
    });

    const centerArcBack = centerArc.map(([x, t]) => [x, -t]);
    ribbon(centerArcBack, u => 1.52 - 0.32 * Math.abs(u - 0.5), 1.641, edgeBlack);
    ribbon(centerArcBack, u => 1.37 - 0.33 * Math.abs(u - 0.5), 1.655, gunmetal);
    ribbon(centerArcBack, u => 1.21 - 0.31 * Math.abs(u - 0.5), 1.665, inset);
    for (const side of [-1, 1]) {
      const edgePath = centerArcBack.map(([x, t]) => [x + side * (0.66 - 0.17 * Math.abs((-t - 1.47) / 0.85)), t]);
      ribbon(edgePath, 0.046, 1.672, enamel);
    }
    armorPanels.forEach(({ t, width }, i) => {
      const tt = -t;
      const outline = [[-width, tt + 0.125], [0, tt + 0.075], [width, tt + 0.125], [width * 0.73, tt - 0.13], [0, tt - 0.20], [-width * 0.73, tt - 0.13], [-width, tt + 0.125]];
      ribbon(outline, 0.045, 1.679, blackMetal);
      ribbon([[0, tt + 0.056], [0, tt - 0.115]], i === 1 ? 0.24 : 0.16, 1.681, greenMetal);
      ribbon([[0, tt + 0.02], [0, tt - 0.08]], 0.038, 1.686, enamel);
    });
    // Thick side-cheeks, green beveled housings and articulated tread blocks.
    for (const side of [-1, 1]) {
      for (let i = -7; i < 9; i++) {
        const t = i >= 0 ? 0.81 + i * 0.205 : -0.81 + (i+1) * 0.205;
        const center = cuffPoint(t, side * 1.84, 1.655);
        const normal = new THREE.Vector3(0, Math.cos(t), Math.sin(t));
        const tread = addMesh(new THREE.BoxGeometry(0.29, 0.105, 0.21), rubber, root, center.toArray());
        tread.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        const groove = addMesh(new THREE.BoxGeometry(0.17, 0.11, 0.019), edgeBlack, tread, [0, 0.004, 0]);
        groove.castShadow = false;
      }
      // Paired forged lugs clamp the top case to the strap instead of hovering over it.
      for (const z of [-0.83, 0.83]) {
        const lug = addMesh(new THREE.BoxGeometry(0.30, 0.24, 0.44), brushed, root, [side * 1.17, 1.63, z]);
        lug.rotation.y = side * 0.14;
        addMesh(new THREE.BoxGeometry(0.32, 0.045, 0.35), blackMetal, root, [side * 1.17, 1.77, z]);
        const pin = addMesh(new THREE.CylinderGeometry(0.053, 0.053, 0.02, 20), gunmetal, root, [side * 1.346, 1.70, z], [0, 0, Math.PI / 2]);
        addMesh(new THREE.BoxGeometry(0.007, 0.052, 0.014), titanium, pin, [0, 0.013, 0]);
      }
      // Recessed oval service ports punctuate the back half of the bracelet.
      for (let i = 0; i < 4; i++) {
        const t = 2.01 + i * 0.133;
        const p = cuffPoint(t, side * 1.12, 1.661);
        const slot = addMesh(new THREE.BoxGeometry(0.17, 0.022, 0.072), edgeBlack, root, p.toArray());
        slot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, Math.cos(t), Math.sin(t)));
      }
    }
    // The reference's bold white angular swept inserts: inset, rather than floating on top.
    const sweepA = [[-0.82, 0.52], [-0.97, 0.83], [-1.00, 1.15], [-0.80, 1.54], [-0.44, 1.94], [-0.20, 2.19]];
    const sweepB = [[0.94, 0.30], [0.82, 0.64], [0.71, 1.04], [0.88, 1.49], [1.15, 1.89]];
    ribbon(sweepA, (u) => 0.40 * Math.sin(Math.PI * (0.08 + u * 0.88)), 1.663, silver);
    ribbon(sweepB, (u) => 0.26 * Math.sin(Math.PI * (0.05 + u * 0.9)), 1.662, silver);
    ribbon([[-0.38,-0.35],[-0.70,-0.70],[-0.90,-1.18],[-1.0,-1.75]], u => 0.25 * Math.sin(Math.PI * (0.08 + u * 0.88)), 1.663, titanium);
    // The chrome sweeps are anchored by small dark screw heads, not floating stickers.
    for (const [x, theta] of [[-0.95, 1.15], [0.8, 0.65], [-0.85, -1.15]]) {
      const p = cuffPoint(theta, x, 1.695);
      const normal = new THREE.Vector3(0, Math.cos(theta), Math.sin(theta));
      const screw = addMesh(new THREE.CylinderGeometry(0.057, 0.057, 0.018, 24), blackMetal, root, p.toArray());
      screw.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      const slot = addMesh(new THREE.BoxGeometry(0.065, 0.005, 0.01), titanium, screw, [0, 0.011, 0]);
      slot.castShadow = false;
    }

    // Right-hand green indicator, mounted in its own black sealed recess.
    const leds = [], ledLamps = [];
     function addIndicator(x, theta) {
       const g = new THREE.Group();
       g.position.copy(cuffPoint(theta, x, 1.71));
       g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, Math.cos(theta), Math.sin(theta)));
       root.add(g);
       addMesh(new THREE.CylinderGeometry(0.23, 0.23, 0.065, 40), blackMetal, g, [0, 0, 0], [Math.PI / 2, 0, 0]);
       const l = addMesh(new THREE.SphereGeometry(0.125, 28, 18), light, g, [0, 0, 0.075]);
       l.scale.set(0.85, 1, 0.45);
       const lamp = new THREE.PointLight(0x75fb44, 0.8, 1.3);
       lamp.position.set(0, 0, 0.16);
       g.add(lamp);
       leds.push(l); ledLamps.push(lamp);
     }
     addIndicator(1.41, 0.99);
     addIndicator(-1.41, 0.99);
     addIndicator(1.41, -0.99);
     addIndicator(-1.41, -0.99);

      // Fixed chassis, luminous actuator, and independently lifted crown: the reveal
      // exposes an actual mechanical stack instead of lifting a single flat disk.

    const chassis = new THREE.Group(); chassis.position.y = 1.59; root.add(chassis);
    addMesh(new THREE.CylinderGeometry(1.19, 1.32, 0.22, 96), blackMetal, chassis, [0, 0.05, 0]);
    addMesh(new THREE.CylinderGeometry(1.10, 1.18, 0.06, 96), titanium, chassis, [0, 0.18, 0]);
    addMesh(new THREE.TorusGeometry(1.13, 0.033, 10, 96), greenMetal, chassis, [0, 0.22, 0], [-Math.PI / 2, 0, 0]);
    addMesh(new THREE.CylinderGeometry(0.59, 0.65, 0.62, 64), gunmetal, chassis, [0, 0.47, 0]);
    addMesh(new THREE.CylinderGeometry(0.47, 0.47, 0.64, 64), blackMetal, chassis, [0, 0.47, 0]);
    const actuator = new THREE.Group(); actuator.position.y = 1.70; root.add(actuator);
    addMesh(new THREE.CylinderGeometry(0.93, 0.99, 0.12, 96), greenMetal, actuator, [0, 0.11, 0]);
    addMesh(new THREE.TorusGeometry(0.96, 0.027, 10, 96), light, actuator, [0, 0.19, 0], [-Math.PI / 2, 0, 0]);
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12;
      const tooth = addMesh(new THREE.BoxGeometry(0.07, 0.08, 0.18), i % 3 === 0 ? titanium : gunmetal, actuator, [Math.sin(a) * 1.025, 0.14, Math.cos(a) * 1.025], [0, -a, 0]);
      tooth.castShadow = false;
    }
    const dial = new THREE.Group(); dial.position.y = 1.75; root.add(dial);
    addMesh(new THREE.CylinderGeometry(0.54, 0.56, 0.31, 64), titanium, dial, [0, -0.13, 0]);
    addMesh(new THREE.CylinderGeometry(0.44, 0.44, 0.34, 64), blackMetal, dial, [0, -0.13, 0]);
    addMesh(new THREE.CylinderGeometry(1.22, 1.32, 0.22, 96), blackMetal, dial, [0, 0.10, 0]);
    addMesh(new THREE.TorusGeometry(1.28, 0.045, 12, 96), edgeBlack, dial, [0, 0.09, 0], [-Math.PI / 2, 0, 0]);
    addMesh(new THREE.CylinderGeometry(1.12, 1.22, 0.14, 96), greenMetal, dial, [0, 0.28, 0]);
    for (let i = 0; i < 72; i++) {
      const a = i * Math.PI / 36;
      const knurl = addMesh(new THREE.BoxGeometry(0.018, 0.073, 0.06), i % 6 === 0 ? silver : gunmetal, dial, [Math.sin(a) * 1.181, 0.26, Math.cos(a) * 1.181], [0, -a, 0]);
      knurl.castShadow = false;
    }
    addMesh(new THREE.TorusGeometry(1.115, 0.045, 12, 96), titanium, dial, [0, 0.358, 0], [-Math.PI / 2, 0, 0]);
    addMesh(new THREE.CylinderGeometry(1.045, 1.045, 0.075, 96), blackMetal, dial, [0, 0.354, 0]);

    // The green hourglass is the face itself; black side wedges have actual beveled depth.
    addMesh(new THREE.CylinderGeometry(0.99, 0.99, 0.075, 96), faceGreen, dial, [0, 0.422, 0]);
    for (const side of [-1, 1]) {
      const shape = new THREE.Shape();
      shape.moveTo(side * 0.13, 0);
      for (let j = 0; j <= 32; j++) {
        const a = -1.04 + j * 2.08 / 32;
        shape.lineTo(side * 0.965 * Math.cos(a), 0.965 * Math.sin(a));
      }
      shape.closePath();
      const wedge = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.012, bevelThickness: 0.009 });
      addMesh(wedge, faceBlack, dial, [0, 0.474, 0], [-Math.PI / 2, 0, 0]);
    }
    addMesh(new THREE.TorusGeometry(0.99, 0.034, 12, 96), edgeBlack, dial, [0, 0.47, 0], [-Math.PI / 2, 0, 0]);
    addMesh(new THREE.TorusGeometry(1.035, 0.014, 8, 96), silver, dial, [0, 0.422, 0], [-Math.PI / 2, 0, 0]);
    // A dark chamfer and a narrow luminous inner gasket make the face sit *inside* the bezel.
    addMesh(new THREE.TorusGeometry(0.974, 0.017, 8, 96), gunmetal, dial, [0, 0.51, 0], [-Math.PI / 2, 0, 0]);
    const dialLamp = new THREE.PointLight(0x78ed52, 0.48, 2.5); dialLamp.position.set(0, 0.68, 0); dial.add(dialLamp);
    // Engraved indices and recessed fasteners give the surround realistic scale.
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const tick = addMesh(new THREE.BoxGeometry(i % 3 === 0 ? 0.11 : 0.055, 0.012, 0.018), i % 3 === 0 ? titanium : greenMetal, dial, [Math.sin(a) * 1.165, 0.364, Math.cos(a) * 1.165], [0, -a, 0]);
      tick.castShadow = false;
    }
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2;
      addMesh(new THREE.CylinderGeometry(0.041, 0.041, 0.012, 16), titanium, dial, [Math.sin(a) * 1.185, 0.37, Math.cos(a) * 1.185]);
    }

    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(7.1, 10.8, 9.8);
      // Keep the entire cuff within narrow portrait viewports.
      if (w < h) camera.position.multiplyScalar(Math.min(1.55, 1 + (h / w - 1) * 0.45));
      camera.lookAt(0, 0.05, 0);
    
      const shift = w < h ? 0.05 : 0.11; // smaller shift on portrait phones
      camera.setViewOffset(w, h, -w * shift, 0, w, h); // negative = model moves right
    
      camera.updateProjectionMatrix();
    }
    const observer = new ResizeObserver(resize); observer.observe(host); resize();

    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    const target = { x: root.rotation.x, y: root.rotation.y };
    let dragging = false, moved = false, downX = 0, downY = 0, lastX = 0, lastY = 0;
    let raised = false, mode = 0, hovered = false;
    const modes = [0x65ed39, 0xf04436, 0xf5a83b];
    const dialMeshes = dial.children.filter(c => c.isMesh);
    function hitAt(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects([led, ...dialMeshes], true)[0]?.object;
    }
    function overDialAt(e) {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(dialMeshes, true).length > 0;
    }
    function lift(on) {
      if (raised === on) return;
      raised = on;
      gsap.to(dial.position, { y: on ? 2.38 : 1.75, duration: 0.65, ease: on ? 'back.out(1.25)' : 'power2.inOut', overwrite: true });
      gsap.to(actuator.position, { y: on ? 1.96 : 1.70, duration: 0.58, ease: 'power2.out', overwrite: true });
      gsap.to(actuator.rotation, { y: on ? -Math.PI / 10 : 0, duration: 0.72, ease: 'power2.inOut', overwrite: true });
      gsap.to(dial.rotation, { y: on ? Math.PI / 9 : 0, duration: 0.7, ease: 'power2.inOut', overwrite: true });
      gsap.fromTo(dialLamp, { intensity: on ? 1.5 : 0.8 }, { intensity: 0.48, duration: 0.7, overwrite: true });
    }
    function pointerDown(e) {
      dragging = true; moved = false; downX = lastX = e.clientX; downY = lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    }
    function pointerMove(e) {
      if (!dragging) {
        const overDial = overDialAt(e);
        if (overDial !== hovered) { hovered = overDial; lift(overDial); }
        renderer.domElement.style.cursor = overDial ? 'pointer' : 'grab';
        return;
      }
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) moved = true;
      target.y += dx * 0.008; target.x = THREE.MathUtils.clamp(target.x + dy * 0.006, -0.85, 0.85);
      lastX = e.clientX; lastY = e.clientY;
    }
    function pointerUp(e) {
      if (!dragging) return;
      dragging = false;
      if (moved) { if (e.pointerType === 'mouse') lift(overDialAt(e)); return; }
      const hit = hitAt(e);
      if (!hit) return;
      if (hit === led) {
        mode = (mode + 1) % 3;
        gsap.to(light.color, { r: new THREE.Color(modes[mode]).r, g: new THREE.Color(modes[mode]).g, b: new THREE.Color(modes[mode]).b, duration: 0.35 });
        light.emissive.setHex(modes[mode]); dialLamp.color.setHex(modes[mode]); ledLamp.color.setHex(modes[mode]);
      } else {
        // Taps retain a usable raise/lower action on touch devices without hover.
        if (e.pointerType !== 'mouse') lift(!raised);
      }
    }
    function pointerLeave() { if (!dragging) { hovered = false; lift(false); renderer.domElement.style.cursor = 'grab'; } }
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);
    renderer.domElement.addEventListener('pointerleave', pointerLeave);
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';

    let previousTime = performance.now(); let raf;
    function animate(now) {
      raf = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;
      const dt = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      root.rotation.x = THREE.MathUtils.damp(root.rotation.x, target.x, 7, dt);
      root.rotation.y = THREE.MathUtils.damp(root.rotation.y, target.y, 7, dt);
      renderer.render(scene, camera);
    }
    animate(performance.now());
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); gsap.killTweensOf(dial.position); gsap.killTweensOf(dial.rotation); gsap.killTweensOf(actuator.position); gsap.killTweensOf(actuator.rotation); gsap.killTweensOf(dialLamp); gsap.killTweensOf(light.color);
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      renderer.domElement.removeEventListener('pointerleave', pointerLeave);
      scene.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
      materials.forEach(m => m.dispose()); grainTexture.dispose(); ground.material.dispose(); env.dispose(); pmrem.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return (
    <main className="relative h-dvh min-h-105 overflow-hidden bg-background">
      <div ref={mount} className="absolute inset-0 overflow-hidden" role="img" aria-label="Interactive 3D Omnitrix watch" />
      <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex justify-between gap-4 border-t border-border pt-4 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:bottom-10 sm:left-10 sm:right-10">
        <span>Drag to inspect</span>
        <span>Hover dial to activate</span>
      </div>
    </main>
  );
}
