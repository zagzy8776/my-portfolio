import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// --- Core distorted icosahedron: the centerpiece "identity" shape ---
function CoreShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, pointer } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    // Gentle continuous rotation
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.15 + t * 0.06
    meshRef.current.rotation.y += 0.0025

    // Subtle parallax toward the cursor
    const targetX = (pointer.x * viewport.width) / 24
    const targetY = (pointer.y * viewport.height) / 24
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.03
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.03
  })

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={2.1}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#4E85BF"
          emissive="#1a2e44"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.6}
          distort={0.35}
          speed={1.6}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>
    </Float>
  )
}

// --- A thin orbiting ring for extra depth / motion ---
function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed
  })
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  )
}

function Rig() {
  const { camera, pointer } = useThree()
  useFrame(() => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.02
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3D() {
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768
  const dpr = useMemo<[number, number]>(
    () => [1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isSmallScreen ? 1.5 : 2)],
    [isSmallScreen]
  )
  const sparkleCount = isSmallScreen ? 40 : 90

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      className="!absolute inset-0"
    >
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 6, 13]} />

      <ambientLight intensity={0.35} color="#8aa9c9" />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#89AACC" />
      <pointLight position={[-5, -3, 3]} intensity={2.2} color="#4E85BF" distance={18} />
      <pointLight position={[3, -4, -2]} intensity={1.4} color="#89AACC" distance={16} />
      {/* Rim light standing in for an environment map — keeps the scene fully local, no external HDR fetch */}
      <pointLight position={[0, 2, -6]} intensity={2.6} color="#ffffff" distance={20} />

      <Suspense fallback={null}>
        <CoreShape />
        <OrbitRing radius={2.9} tilt={1.1} speed={0.08} color="#89AACC" />
        <OrbitRing radius={3.4} tilt={0.6} speed={-0.05} color="#4E85BF" />
        <Sparkles count={sparkleCount} scale={9} size={1.4} speed={0.25} color="#89AACC" opacity={0.5} />
      </Suspense>

      <Rig />
    </Canvas>
  )
}
