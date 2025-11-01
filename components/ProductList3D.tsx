'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { type Product, formatPrice } from '@/lib/products'

function Card({
  texture,
  position,
  rotation,
  onClick,
  baseScale = 1,
  onHoverChange,
}: {
  texture: THREE.Texture
  position: [number, number, number]
  rotation: [number, number, number]
  onClick: () => void
  baseScale?: number
  onHoverChange?: (hover: boolean) => void
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)

  useFrame((_s, dt) => {
    if (!mesh.current) return
    // subtle float on hover
    const target = (hovered.current ? 1.08 : 1) * baseScale
    mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, target, 6 * dt)
    mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, target, 6 * dt)
    // lift upward when hovered
    const currentY = mesh.current.position.y
    const targetY = hovered.current ? 0.25 * baseScale : 0
    mesh.current.position.y = THREE.MathUtils.lerp(currentY, targetY, 6 * dt)
    // draw on top while hovered
    mesh.current.renderOrder = hovered.current ? 999 : 0
    const mat = mesh.current.material as THREE.Material
    if (mat) {
      mat.depthTest = !hovered.current ? true : false
    }
  })

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerEnter={() => {
        hovered.current = true
        onHoverChange?.(true)
      }}
      onPointerLeave={() => {
        hovered.current = false
        onHoverChange?.(false)
      }}
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
  const targetAngleRef = useRef<number | null>(null)
  const hoveredSlugRef = useRef<string | null>(null)
  const activeCenteringRef = useRef(false)
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
      return { p, pos: [x, 0, z] as [number, number, number], rot: [0, rotY, 0] as [number, number, number], angle }
    })
  }, [products, layout.radius])

  // Input handlers on the canvas element
  useEffect(() => {
    const el = gl.domElement
    if (!el) return

    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      velocityRef.current += (e.deltaY > 0 ? 1 : -1) * 0.01
      targetAngleRef.current = null
      activeCenteringRef.current = false
      hoveredSlugRef.current = null
    }

    const down = (e: PointerEvent) => {
      draggingRef.current = true
      lastXRef.current = e.clientX
      movedRef.current = 0
  targetAngleRef.current = null
  activeCenteringRef.current = false
  hoveredSlugRef.current = null
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
    // If a target angle is set (e.g., hover to center), ease toward it
    if (!draggingRef.current && targetAngleRef.current != null) {
      const current = angleRef.current
      const target = targetAngleRef.current
      // shortest angular delta in range [-PI, PI]
      let delta = target - current
      delta = ((delta + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI
      // ease toward target
      angleRef.current += delta * Math.min(1, dt * 6)
      // If close enough, snap and release lock
      if (Math.abs(delta) < 0.01) {
        angleRef.current = target
        targetAngleRef.current = null
        activeCenteringRef.current = false
      } else {
        activeCenteringRef.current = true
      }
      // damp velocity while targeting
      velocityRef.current *= 0.9
    } else {
      // free spin inertia
      angleRef.current += velocityRef.current * dt * 60 * 0.02
      velocityRef.current *= 0.95
    }
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
      {items.map(({ p, pos, rot, angle }, i) => {
        const tex = Array.isArray(textures) ? (textures as THREE.Texture[])[i] : (textures as any)
        if (!tex) return null
        const scale = layout.baseScale
        const cardHeight = 1.0 * scale
        const setHover = (hover: boolean) => {
          if (hover) {
            // If already centering another card, ignore new enters
            if (activeCenteringRef.current && hoveredSlugRef.current && hoveredSlugRef.current !== p.slug) return
            // Lock onto this item and center it
            hoveredSlugRef.current = p.slug
            targetAngleRef.current = Math.PI / 2 - angle
            activeCenteringRef.current = true
          } else {
            // Only release if this same card was locked and centering is not active
            if (hoveredSlugRef.current === p.slug && !activeCenteringRef.current) {
              hoveredSlugRef.current = null
              targetAngleRef.current = null
            }
          }
        }
        return (
          <group key={p.slug} position={pos} rotation={rot}>
            <Card texture={tex} position={[0, 0, 0]} rotation={[0, 0, 0]} onClick={handleCardClick(p.slug)} baseScale={scale} onHoverChange={setHover} />
            <Text
              position={[0, -cardHeight * 0.65, 0.01]}
              fontSize={0.12 * scale}
              anchorX="center"
              anchorY="top"
              maxWidth={1.6 * scale}
              color="#111111"
              outlineWidth={0.008 * scale}
              outlineColor="#ffffff"
            >
              {`${p.title} · ${formatPrice(p.price)}`}
            </Text>
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
        camera={{ position: [0, 8, 12], zoom: 110, near: -1000, far: 1000 }}
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
