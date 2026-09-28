import { Canvas } from "@react-three/fiber";

function Intro() {
  return (
    <section className="relative z-10 h-screen w-full overflow-hidden bg-black text-white">

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
        <Canvas />
      </div>

    </section>
  );
}

export default Intro;