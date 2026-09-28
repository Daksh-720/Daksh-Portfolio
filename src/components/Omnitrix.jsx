import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

// A single-file, fully procedural Omnitrix. Drag to turn; tap the dial to raise/lower it;
// tap the small green button to change the selected glow.
export default function Omnitrix() {
  const mount = useRef(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07100b);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(5.6, 4.4, 8.6);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
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
    scene.environmentIntensity = 0.22;
    scene.add(new THREE.HemisphereLight(0xd9ffe1, 0x20291f, 0.65));
    const key = new THREE.DirectionalLight(0xf5fff4, 1.6);
    key.position.set(-3, 7, 6);
    scene.add(key);
    const edge = new THREE.DirectionalLight(0xa0feba, 0.8);
    edge.position.set(4, 4, -5);
    scene.add(edge);
    const fill = new THREE.DirectionalLight(0xe1e9e5, 0.5);
    fill.position.set(6, -1, 5);
    scene.add(fill);

    const root = new THREE.Group();
    root.rotation.set(-0.04, -0.27, -0.07);
    scene.add(root);

    const rubber = new THREE.MeshPhysicalMaterial({ color: 0x070b09, roughness: 0.76, metalness: 0.08, clearcoat: 0.12, clearcoatRoughness: 0.43 });
    const innerRubber = new THREE.MeshStandardMaterial({ color: 0x0c100e, roughness: 0.87, side: THREE.DoubleSide });
    const panel = new THREE.MeshPhysicalMaterial({ color: 0x0b100d, metalness: 0.3, roughness: 0.32, clearcoat: 0.58, clearcoatRoughness: 0.22, side: THREE.DoubleSide });
    const edgeBlack = new THREE.MeshStandardMaterial({ color: 0x080c09, metalness: 0.3, roughness: 0.49, side: THREE.DoubleSide });
    const titanium = new THREE.MeshStandardMaterial({ color: 0xb3c1b9, metalness: 0.9, roughness: 0.27, side: THREE.DoubleSide });
    const silver = new THREE.MeshPhysicalMaterial({ color: 0xe4ebe5, metalness: 0.72, roughness: 0.18, clearcoat: 0.95, side: THREE.DoubleSide });
    const greenMetal = new THREE.MeshPhysicalMaterial({ color: 0x1c3725, metalness: 0.8, roughness: 0.24, clearcoat: 0.64 });
    const blackMetal = new THREE.MeshStandardMaterial({ color: 0x101713, metalness: 0.75, roughness: 0.34 });
    const light = new THREE.MeshPhysicalMaterial({ color: 0x9dfc63, emissive: 0x65ed39, emissiveIntensity: 1.2, roughness: 0.18, metalness: 0.12, clearcoat: 1 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xc5eac9, metalness: 0.05, roughness: 0.08, transmission: 0.3, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.055, depthWrite: false });
    const materials = [rubber, innerRubber, panel, edgeBlack, titanium, silver, greenMetal, blackMetal, light, glass];

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
    }
    // The reference's bold white angular swept inserts: inset, rather than floating on top.
    const sweepA = [[-0.82, 0.52], [-0.97, 0.83], [-1.00, 1.15], [-0.80, 1.54], [-0.44, 1.94], [-0.20, 2.19]];
    const sweepB = [[0.94, 0.30], [0.82, 0.64], [0.71, 1.04], [0.88, 1.49], [1.15, 1.89]];
    ribbon(sweepA, (u) => 0.40 * Math.sin(Math.PI * (0.08 + u * 0.88)), 1.663, silver);
    ribbon(sweepB, (u) => 0.26 * Math.sin(Math.PI * (0.05 + u * 0.9)), 1.662, silver);
    ribbon([[-0.38,-0.35],[-0.70,-0.70],[-0.90,-1.18],[-1.0,-1.75]], u => 0.25 * Math.sin(Math.PI * (0.08 + u * 0.88)), 1.663, titanium);

    // Right-hand green indicator, mounted in its own black sealed recess.
    const indicator = new THREE.Group();
    indicator.position.copy(cuffPoint(0.99, 1.41, 1.71));
    indicator.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, Math.cos(0.99), Math.sin(0.99)));
    root.add(indicator);
    addMesh(new THREE.CylinderGeometry(0.23, 0.23, 0.065, 40), blackMetal, indicator, [0, 0, 0], [Math.PI / 2, 0, 0]);
    const led = addMesh(new THREE.SphereGeometry(0.125, 28, 18), light, indicator, [0, 0, 0.075]);
    led.scale.set(0.85, 1, 0.45);
    const ledLamp = new THREE.PointLight(0x75fb44, 0.8, 1.3); ledLamp.position.set(0, 0, 0.16); indicator.add(ledLamp);

    // Low, circular top housing: dark beveled shell, olive machined ring, inset luminous glass.
    const dial = new THREE.Group(); dial.position.y = 1.57; root.add(dial);
    addMesh(new THREE.CylinderGeometry(1.22, 1.35, 0.22, 96), blackMetal, dial, [0, 0.10, 0]);
    addMesh(new THREE.CylinderGeometry(1.12, 1.22, 0.14, 96), greenMetal, dial, [0, 0.28, 0]);
    addMesh(new THREE.TorusGeometry(1.115, 0.045, 12, 96), titanium, dial, [0, 0.358, 0], [-Math.PI / 2, 0, 0]);
    addMesh(new THREE.CylinderGeometry(1.045, 1.045, 0.075, 96), blackMetal, dial, [0, 0.354, 0]);

    // The Omnitrix's green hourglass is physically inset beneath a green crystal.
    const faceCanvas = document.createElement('canvas'); faceCanvas.width = faceCanvas.height = 512;
    const ctx = faceCanvas.getContext('2d');
    const grd = ctx.createRadialGradient(215, 175, 15, 256, 256, 330);
    grd.addColorStop(0, '#c9ffb1'); grd.addColorStop(0.47, '#69e34d'); grd.addColorStop(0.85, '#245c2e'); grd.addColorStop(1, '#0b1d11');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = 'rgba(10,26,13,.76)';
    ctx.beginPath(); ctx.moveTo(85, 95); ctx.lineTo(425, 95); ctx.lineTo(287, 256); ctx.lineTo(425, 417);
    ctx.lineTo(85, 417); ctx.lineTo(225, 256); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(218,255,188,.32)'; ctx.lineWidth = 8; ctx.stroke();
    const faceTexture = new THREE.CanvasTexture(faceCanvas); faceTexture.colorSpace = THREE.SRGBColorSpace;
    const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture, emissive: 0x3de22d, emissiveIntensity: 0.22, roughness: 0.42 });
    // Cylinder UV face is radial and stretches the image; a horizontal plane retains the crisp symbol.
    addMesh(new THREE.CircleGeometry(0.99, 96), faceMat, dial, [0, 0.401, 0], [-Math.PI / 2, 0, 0]);
    const crystal = addMesh(new THREE.SphereGeometry(1.02, 64, 24, 0, Math.PI * 2, 0, Math.PI * 0.17), glass, dial, [0, 0.32, 0]);
    crystal.scale.y = 0.18;
    addMesh(new THREE.TorusGeometry(1.005, 0.025, 10, 96), greenMetal, dial, [0, 0.404, 0], [-Math.PI / 2, 0, 0]);
    const dialLamp = new THREE.PointLight(0x78ed52, 1.1, 2.5); dialLamp.position.set(0, 0.7, 0); dial.add(dialLamp);
    // Six fine cut marks in the metal surround.
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      const tick = addMesh(new THREE.BoxGeometry(0.08, 0.012, 0.025), titanium, dial, [Math.sin(a) * 1.167, 0.365, Math.cos(a) * 1.167], [0, -a, 0]);
      tick.castShadow = false;
    }

    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(5.6, 4.4, 8.6);
      // Keep the entire cuff within narrow portrait viewports.
      if (w < h) camera.position.multiplyScalar(Math.min(2.35, 1 + (h / w - 1) * 0.96));
      camera.lookAt(0, 0.05, 0); camera.updateProjectionMatrix();
    }
    const observer = new ResizeObserver(resize); observer.observe(host); resize();

    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    const target = { x: root.rotation.x, y: root.rotation.y };
    let dragging = false, moved = false, downX = 0, downY = 0, lastX = 0, lastY = 0;
    let raised = false, mode = 0;
    const modes = [0x65ed39, 0xf04436, 0xf5a83b];
    function pointerDown(e) {
      dragging = true; moved = false; downX = lastX = e.clientX; downY = lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    }
    function pointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) moved = true;
      target.y += dx * 0.008; target.x = THREE.MathUtils.clamp(target.x + dy * 0.006, -0.85, 0.85);
      lastX = e.clientX; lastY = e.clientY;
    }
    function pointerUp(e) {
      if (!dragging) return;
      dragging = false;
      if (moved) return;
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([led, ...dial.children.filter(c => c.isMesh)], true);
      if (!hits.length) return;
      if (hits[0].object === led) {
        mode = (mode + 1) % 3;
        gsap.to(light.color, { r: new THREE.Color(modes[mode]).r, g: new THREE.Color(modes[mode]).g, b: new THREE.Color(modes[mode]).b, duration: 0.35 });
        light.emissive.setHex(modes[mode]); dialLamp.color.setHex(modes[mode]); ledLamp.color.setHex(modes[mode]);
      } else {
        raised = !raised;
        gsap.to(dial.position, { y: raised ? 2.02 : 1.57, duration: 0.42, ease: raised ? 'back.out(2)' : 'power2.inOut' });
        gsap.to(dial.rotation, { y: raised ? Math.PI / 6 : 0, duration: 0.55, ease: 'power2.inOut' });
        gsap.fromTo(dialLamp, { intensity: 3.5 }, { intensity: 1.1, duration: 0.65 });
      }
    }
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';

    const clock = new THREE.Clock(); let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      root.rotation.x = THREE.MathUtils.damp(root.rotation.x, target.x, 7, dt);
      root.rotation.y = THREE.MathUtils.damp(root.rotation.y, target.y, 7, dt);
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); gsap.killTweensOf(dial.position); gsap.killTweensOf(dial.rotation);
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      scene.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
      materials.forEach(m => m.dispose()); faceMat.dispose(); faceTexture.dispose(); env.dispose(); pmrem.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="h-screen w-screen overflow-hidden bg-background" aria-label="Interactive 3D Omnitrix watch" />;
}
