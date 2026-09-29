import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ParticleField from "./ParticleField";
import Omnitrix from "./Omnitrix";

function Intro() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "400px" } // Activate 400px before scrolling into view for seamless transition
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 h-screen w-full overflow-hidden bg-black text-white">

      {/* Intro text */}
      <div className="absolute left-[8%] top-1/2 z-10 -translate-y-1/2">
        <p className="mb-4 text-sm tracking-[0.4em] text-gray-400">
          CREATIVE FULL-STACK DEVELOPER
        </p>

        <h1 className="text-7xl font-bold tracking-tight">
          DAKSH SALVI
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
          I build immersive digital experiences through code,
          creativity, and technology.
        </p>
      </div>

      {/* Three.js canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 60}} 
          gl={{ antialias: true, powerPreference: "high-performance" }}
          frameloop={isVisible ? "always" : "never"}
        >
            <ParticleField />

            <EffectComposer>
                <Bloom 
                   intensity={1}
                   luminanceThreshold={0.1}
                   luminanceSmoothing={0.9}
                   mipmapBlur
                   />
            </EffectComposer>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0">
        <Omnitrix isVisible={isVisible} />
      </div>

    </section>
  );
}

export default Intro;