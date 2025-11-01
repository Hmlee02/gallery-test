'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import type { Product } from '@/lib/products'

function Card({
  texture,
  position,
  rotation,
  onClick,
  baseScale = 1,
}: {
  texture: THREE.Texture
  position: [number, number, number]
  rotation: [number, number, number]
  onClick: () => void
  baseScale?: number
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)

  useFrame((_s, dt) => {
    if (!mesh.current) return
    // subtle float on hover
    const target = (hovered.current ? 1.02 : 1) * baseScale
    mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, target, 6 * dt)
    mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, target, 6 * dt)
  })

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <planeGeometry args={[1.4, 1.0, 1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SceneProducts({ products }: { products: Product[] }) {
  const textures = useTexture(products.map((p) => p.image))
  const ringRef = useRef<THREE.Group>(null)
  const angleRef = useRef(0)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const lastXRef = useRef(0)
  const movedRef = useRef(0)
  const { gl, size, camera } = useThree()
  // layout metrics derived from camera frustum
  const layout = useMemo(() => {
    let visibleWidth = 8
    if ((camera as any).isPerspectiveCamera) {
      const cam = camera as THREE.PerspectiveCamera
      const zDepth = Math.max(0.0001, cam.position.z)
      const vFOV = THREE.MathUtils.degToRad(cam.fov)
      const visibleHeight = 2 * Math.tan(vFOV / 2) * zDepth
      visibleWidth = visibleHeight * (size.width > 0 ? size.width / Math.max(1, size.height) : cam.aspect)
    } else if ((camera as any).isOrthographicCamera) {
      const cam = camera as THREE.OrthographicCamera
      // For orthographic camera, visible span in world units is size / zoom
      const vW = size.width > 0 ? size.width : 1920
      const vH = size.height > 0 ? size.height : 1080
      const visibleHeight = vH / Math.max(1e-6, cam.zoom)
      visibleWidth = vW / Math.max(1e-6, cam.zoom)
    }
    const gutter = 0.25
    const baseCardWidth = 1.4
    const approxVisible = Math.min(products.length, Math.max(4, Math.floor(products.length * 0.5)))
    // Fill factor < 1.0 makes the ring/cards appear smaller on screen
    const fill = 0.8
    const desiredCardWorldWidth = THREE.MathUtils.clamp(((visibleWidth * fill) - gutter * 2) / approxVisible, 0.9, 2.2)
    const baseScale = desiredCardWorldWidth / baseCardWidth
    const radius = Math.max(2.5, ((visibleWidth * fill) / 2) - (desiredCardWorldWidth / 2) - gutter)
    return { visibleWidth, gutter, desiredCardWorldWidth, baseScale, radius }
  }, [camera, size.width, size.height, products.length])
  const items = useMemo(() => {
    const r = layout.radius
    return products.map((p, i) => {
      const angle = (i / Math.max(products.length, 1)) * Math.PI * 2
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const rotY = -angle + Math.PI
      return { p, pos: [x, 0, z] as [number, number, number], rot: [0, rotY, 0] as [number, number, number] }
    })
  }, [products, layout.radius])

  // Input handlers on the canvas element
  useEffect(() => {
    const el = gl.domElement
    if (!el) return

    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      velocityRef.current += (e.deltaY > 0 ? 1 : -1) * 0.01
    }

    const down = (e: PointerEvent) => {
      draggingRef.current = true
      lastXRef.current = e.clientX
      movedRef.current = 0
      // capture pointer to continue receiving move events
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!draggingRef.current) return
      const dx = e.clientX - lastXRef.current
      lastXRef.current = e.clientX
      movedRef.current += Math.abs(dx)
      angleRef.current += dx * 0.005
    }
    const up = (_e: PointerEvent) => {
      draggingRef.current = false
      // give a bit of inertia based on last movement
      const sign = Math.sign(lastXRef.current)
      velocityRef.current += sign * 0.0 // minimal kick; main rotation already applied
    }

    el.addEventListener('wheel', wheel, { passive: false })
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)

    return () => {
      el.removeEventListener('wheel', wheel as any)
      el.removeEventListener('pointerdown', down as any)
      el.removeEventListener('pointermove', move as any)
      el.removeEventListener('pointerup', up as any)
      el.removeEventListener('pointercancel', up as any)
    }
  }, [gl])

  // Animate ring rotation with damping
  useFrame((_s, dt) => {
    angleRef.current += velocityRef.current * dt * 60 * 0.02
    // damping
    velocityRef.current *= 0.95
    if (ringRef.current) {
      ringRef.current.rotation.y = angleRef.current
    }
  })

  const handleCardClick = (slug: string) => () => {
    // If user dragged more than a small threshold, suppress click
    if (draggingRef.current || movedRef.current > 5) return
    if (typeof window !== 'undefined') window.location.href = `/products/${slug}`
  }

  return (
    <group ref={ringRef}>
      {items.map(({ p, pos, rot }, i) => {
        const tex = Array.isArray(textures) ? (textures as THREE.Texture[])[i] : (textures as any)
        if (!tex) return null
        const scale = layout.baseScale
        const cardHeight = 1.0 * scale
        return (
          <group key={p.slug} position={pos} rotation={rot}>
            <Card texture={tex} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleCardClick(p.slug)} baseScale={scale} />
          </group>
        )
      })}
    </group>
  )
}

export default function ProductList3D({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className ?? ''}`} style={{ height: '100vh' }}>
      <Canvas
        orthographic
        camera={{ position: [0, 10, 4], zoom: 110, near: -1000, far: 1000 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onCreated={({ camera }) => {
          const cam = camera as THREE.OrthographicCamera
          cam.up.set(0, 1, 0)
          cam.lookAt(0, 0, 0)
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.25} />
        <SceneProducts products={products} />
      </Canvas>
    </div>
  )
}
