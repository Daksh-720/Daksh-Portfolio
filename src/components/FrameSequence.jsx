import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 300;

export default function FrameSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  // Helper to format frame filename
  const getFrameUrl = (index) => {
    const frameNum = String(index + 1).padStart(3, "0");
    return `/Portfolio-frames/ezgif-frame-${frameNum}.png`;
  };

  // Find nearest loaded frame to prevent any blank flashes
  const getBestImage = (targetIndex) => {
    const images = imagesRef.current;
    if (images[targetIndex]?.complete && images[targetIndex]?.naturalWidth) {
      return images[targetIndex];
    }
    // Search backward
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (images[i]?.complete && images[i]?.naturalWidth) return images[i];
    }
    // Search forward
    for (let i = targetIndex + 1; i < TOTAL_FRAMES; i++) {
      if (images[i]?.complete && images[i]?.naturalWidth) return images[i];
    }
    return null;
  };

  // Draw frame on canvas with high-DPI supersampling & razor-sharp filtering
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const img = getBestImage(frameIndex);
    if (!img) return;

    // Supersample at least 2x (or native display DPI if higher) for 4K clarity
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const targetW = Math.round(winW * dpr);
    const targetH = Math.round(winH * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // Enable high quality bicubic resampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;
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

    // Draw directly onto high-resolution canvas buffer with integer coordinates
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  };

  // Preload frames progressively
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES);
    let isCancelled = false;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.decoding = "async";
    imagesRef.current[0] = firstImg;

    firstImg.onload = () => {
      if (isCancelled) return;
      drawFrame(0);

      // Keyframes first (every 4th frame) for rapid scrubbing responsiveness
      const keyframes = [];
      for (let i = 1; i < TOTAL_FRAMES; i += 4) keyframes.push(i);

      // Remaining frames
      const remaining = [];
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 4 !== 0) remaining.push(i);
      }

      const queue = [...keyframes, ...remaining];
      let queueIdx = 0;
      const CONCURRENCY = 12;

      const loadNext = () => {
        if (isCancelled || queueIdx >= queue.length) return;
        const idx = queue[queueIdx++];
        const img = new Image();
        img.decoding = "async";
        img.src = getFrameUrl(idx);
        imagesRef.current[idx] = img;

        const onDone = () => {
          if (isCancelled) return;
          loadNext();
        };

        img.onload = onDone;
        img.onerror = onDone;
      };

      for (let c = 0; c < CONCURRENCY; c++) {
        loadNext();
      }
    };

    return () => {
      isCancelled = true;
    };
  }, []);

  // GSAP ScrollTrigger for ultra-smooth frame changes
  useEffect(() => {
    if (!containerRef.current) return;

    const frameTracker = { frame: 0 };

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35, // Butter-smooth momentum scrub
      onUpdate: (self) => {
        const prog = self.progress;
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(prog * (TOTAL_FRAMES - 1)))
        );

        if (targetFrame !== frameTracker.frame) {
          frameTracker.frame = targetFrame;
          requestAnimationFrame(() => {
            drawFrame(targetFrame);
          });
        }
      },
    });

    const handleResize = () => {
      drawFrame(frameTracker.frame);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      st.kill();
      window.removeEventListener("resize", handleResize);
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