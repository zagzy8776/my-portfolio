import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// --- Professional faceted "mind/builder" core: human-like profile silhouette ---
function CoreShape() {
  const meshRef = useRef<THREE.Group>(null)
  const { viewport, pointer } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    // Subtle, confident rotation
    meshRef.current.rotation.y = Math.sin(t * 0.08) * 0.08
    meshRef.current.rotation.x = Math.cos(t * 0.1) * 0.05 + 0.1

    // Parallax follow cursor
    const targetX = (pointer.x * viewport.width) / 32
    const targetY = (pointer.y * viewport.height) / 32
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.04
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.04
  })

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={meshRef} scale={1.8}>
        {/* Main body/core — geometric faceted form */}
        <mesh position={[0, 0, 0]}>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#4E85BF"
            metalness={0.75}
            roughness={0.18}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Upper accent — suggests "mind" or "head" */}
        <mesh position={[0, 1.2, 0]} scale={[0.7, 0.8, 0.7]}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color="#89AACC"
            metalness={0.65}
            roughness={0.2}
          />
        </mesh>

        {/* Side accent panels — depth, sophistication */}
        <mesh position={[-0.95, 0, 0]} scale={[0.35, 1.1, 0.5]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#4E85BF"
            metalness={0.6}
            roughness={0.25}
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh position={[0.95, 0, 0]} scale={[0.35, 1.1, 0.5]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#4E85BF"
            metalness={0.6}
            roughness={0.25}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
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
      {/* Minimal fog for depth — much less blur */}
      <fog attach="fog" args={['#0a0a0a', 8, 20]} />

      {/* Professional three-point lighting */}
      {/* Key light — front-left, warm but professional */}
      <directionalLight position={[5, 8, 6]} intensity={1.6} color="#e8f0ff" />
      
      {/* Fill light — opposite side, softer, keeps shadows readable */}
      <directionalLight position={[-6, 3, -8]} intensity={0.5} color="#89AACC" />
      
      {/* Rim/back light — separates subject from background */}
      <pointLight position={[0, 5, -12]} intensity={2.0} color="#ffffff" distance={22} />
      
      {/* Subtle ambient — fills without washing out */}
      <ambientLight intensity={0.25} color="#a8c5dd" />

      <Suspense fallback={null}>
        <CoreShape />
        {/* Minimal orbit rings — intentional structure, not decoration */}
        <OrbitRing radius={3.2} tilt={1.3} speed={0.06} color="#89AACC" />
        <OrbitRing radius={4.1} tilt={0.4} speed={-0.04} color="#4E85BF" />
        {/* Sparse, purposeful sparkles — tech/data feel, not magical */}
        <Sparkles count={Math.max(30, sparkleCount / 3)} scale={10} size={0.8} speed={0.15} color="#ffffff" opacity={0.4} />
      </Suspense>

      <Rig />
    </Canvas>
  )
}
