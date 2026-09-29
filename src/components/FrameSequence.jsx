import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 300;

export default function FrameSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const coordsRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const currentFrameRef = useRef(-1);
  const imagesRef = useRef(new Array(TOTAL_FRAMES));

  // Helper to format frame filename
  const getFrameUrl = (index) => {
    const frameNum = String(index + 1).padStart(3, "0");
    return `/Portfolio-frames/ezgif-frame-${frameNum}.png`;
  };

  // Find nearest decoded frame to prevent any blank flashes
  const getBestImage = (targetIndex) => {
    const images = imagesRef.current;
    if (images[targetIndex]?.naturalWidth) {
      return images[targetIndex];
    }
    // Search backward
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (images[i]?.naturalWidth) return images[i];
    }
    // Search forward
    for (let i = targetIndex + 1; i < TOTAL_FRAMES; i++) {
      if (images[i]?.naturalWidth) return images[i];
    }
    return null;
  };

  // Ultra-fast blit with zero layout thrashing or context recreation
  const drawFrame = (frameIndex) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const img = getBestImage(frameIndex);
    if (!img) return;

    const { x, y, w, h } = coordsRef.current;
    ctx.drawImage(img, x, y, w, h);
    currentFrameRef.current = frameIndex;
  };

  // Update canvas buffer and precompute rendering geometry only on resize/init
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const targetW = Math.round(winW * dpr);
    const targetH = Math.round(winH * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    ctxRef.current = ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium"; // GPU-accelerated bilinear filtering

    const imgW = 1670;
    const imgH = 941;
    const imgRatio = imgW / imgH;
    const canvasRatio = targetW / targetH;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = targetW;
      renderH = Math.round(targetW / imgRatio);
      offsetX = 0;
      offsetY = Math.round((targetH - renderH) / 2);
    } else {
      renderW = Math.round(targetH * imgRatio);
      renderH = targetH;
      offsetX = Math.round((targetW - renderW) / 2);
      offsetY = 0;
    }

    coordsRef.current = { x: offsetX, y: offsetY, w: renderW, h: renderH };

    if (currentFrameRef.current >= 0) {
      drawFrame(currentFrameRef.current);
    }
  };

  // Progressive preloader with async bitmap decoding off the main thread
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES);
    let isCancelled = false;

    const loadFrame = (idx) => {
      if (imagesRef.current[idx]) return Promise.resolve(imagesRef.current[idx]);

      const img = new Image();
      img.decoding = "async";
      img.src = getFrameUrl(idx);
      imagesRef.current[idx] = img;

      if ("decode" in img) {
        return img
          .decode()
          .catch(() => {})
          .then(() => {
            if (!isCancelled && currentFrameRef.current === idx) {
              drawFrame(idx);
            }
            return img;
          });
      } else {
        return new Promise((resolve) => {
          img.onload = () => {
            if (!isCancelled && currentFrameRef.current === idx) {
              drawFrame(idx);
            }
            resolve(img);
          };
          img.onerror = () => resolve(img);
        });
      }
    };

    // Load first frame immediately for instant first paint
    loadFrame(0).then(() => {
      if (isCancelled) return;
      drawFrame(0);

      // 1. Initial window (frames 1-15) for immediate scrub smoothness
      const initialWindow = [];
      for (let i = 1; i <= Math.min(15, TOTAL_FRAMES - 1); i++) {
        initialWindow.push(i);
      }

      // 2. Keyframes across the sequence (every 4th frame)
      const keyframes = [];
      for (let i = 16; i < TOTAL_FRAMES; i += 4) {
        keyframes.push(i);
      }

      // 3. Fill in all remaining intermediate frames
      const remaining = [];
      for (let i = 16; i < TOTAL_FRAMES; i++) {
        if (i % 4 !== 0) remaining.push(i);
      }

      const queue = [...initialWindow, ...keyframes, ...remaining];
      let queueIdx = 0;
      const CONCURRENCY = 6; // Optimal concurrency to avoid network/thread congestion

      const loadNext = () => {
        if (isCancelled || queueIdx >= queue.length) return;
        const nextIdx = queue[queueIdx++];
        loadFrame(nextIdx).finally(() => {
          if (!isCancelled) {
            loadNext();
          }
        });
      };

      for (let c = 0; c < CONCURRENCY; c++) {
        loadNext();
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // GSAP ScrollTrigger tween with high-precision momentum scrub
  useEffect(() => {
    if (!containerRef.current) return;

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const playhead = { frame: 0 };

    const tween = gsap.to(playhead, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45, // Fluid momentum scrub
      },
      onUpdate: () => {
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(playhead.frame))
        );

        if (targetFrame !== currentFrameRef.current) {
          drawFrame(targetFrame);
        }
      },
    });

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <div ref={containerRef} className="immersive-container">
      {/* Pinned full-screen canvas */}
      <div className="canvas-pin">
        <canvas ref={canvasRef} className="cinema-canvas" />
        <div className="cinematic-vignette" />
      </div>

      {/* Subtle bottom scroll hint */}
      <div className="scroll-hint-wrapper">
        <div className="scroll-arrow-line">
          <div className="scroll-arrow-dot" />
        </div>
        <span className="scroll-hint-text">SCROLL</span>
      </div>
    </div>
  );
}