import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const pointsRef = useRef(null);

  const particles = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = (Math.random() - 0.5) * 7;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];
    }

    return { positions, originalPositions, count };
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const positions = points.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particles.count; i++) {
      const i3 = i * 3;

      positions[i3 + 1] =
        particles.originalPositions[i3 + 1] +
        Math.sin(time * 0.5 + i) * 0.12;

      positions[i3] =
        particles.originalPositions[i3] +
        Math.cos(time * 0.3 + i) * 0.08;
    }

    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={particles.count}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#39ff14"
        size={0.07}
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default ParticleField;