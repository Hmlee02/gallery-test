'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import type { Product } from '@/lib/products'

function Card({
  texture,
  position,
  rotation,
  href,
}: {
  texture: THREE.Texture
  position: [number, number, number]
  rotation: [number, number, number]
  href: string
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)

  useFrame((_s, dt) => {
    if (!mesh.current) return
    // subtle float on hover
    const target = hovered.current ? 1.02 : 1
    mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, target, 6 * dt)
    mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, target, 6 * dt)
  })

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      onClick={() => (window.location.href = href)}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <planeGeometry args={[1.4, 1.0, 1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

function SceneProducts({ products }: { products: Product[] }) {
  const textures = useTexture(products.map((p) => p.image))
  const items = useMemo(() => {
    const r = 4
    return products.map((p, i) => {
      const angle = (i / Math.max(products.length, 1)) * Math.PI * 2
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const rotY = -angle + Math.PI
      return { p, pos: [x, 0, z] as [number, number, number], rot: [0, rotY, 0] as [number, number, number] }
    })
  }, [products])

  return (
    <group>
      {items.map(({ p, pos, rot }, i) => {
        const tex = Array.isArray(textures) ? (textures as THREE.Texture[])[i] : (textures as any)
        if (!tex) return null
        const aspect = tex.image ? tex.image.width / tex.image.height : 1
        const sy = aspect > 1 ? 1.6 : 1.6 / aspect
        return (
          <group key={p.slug} position={pos} rotation={rot}>
            <Card texture={tex} position={[0, 0, 0]} rotation={[0, 0, 0]} href={`/products/${p.slug}`} />
            {/* simple label */}
            <mesh position={[0, -sy * 0.65, 0]}>
              <planeGeometry args={[1.8, 0.35]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.35} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function ProductList3D({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={`w-full rounded-lg overflow-hidden ${className ?? 'h-full'}`}>
      <Canvas camera={{ position: [0, 1.2, 6], fov: 55 }} gl={{ antialias: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.25} />
        <SceneProducts products={products} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
