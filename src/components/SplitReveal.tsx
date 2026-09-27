import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Mesh, Object3D, WebGLRenderer } from 'three'
import { EdgesGeometry, LineBasicMaterial, LineSegments } from 'three'
import { interactionPerf } from '../lib/interactionPerf'

type SplitRevealProps = {
  /** 0 = 全线框，1 = 全实体，0.5 = 左线框右实体 */
  split: number
  root: Object3D
}

const EDGE_THRESHOLD_DEG = 50
const EDGES_PER_FRAME = 8
const WIRE_NAME = 'wireframe-split-clone'

/** 模块级缓存：整体页卸载 SplitReveal 时保留线框，切回无需重建 */
const wireCache = new WeakMap<Object3D, Object3D>()

function removeOrphanWires(root: Object3D, keep?: Object3D | null) {
  const parent = root.parent
  if (!parent) return
  const orphans = parent.children.filter(
    (c) => c.name === WIRE_NAME && c !== keep,
  )
  for (const node of orphans) {
    node.removeFromParent()
    // 缓存命中的不销毁
    if (wireCache.get(root) !== node) disposeWireRoot(node)
  }
}

/**
 * 仅在整体展示页挂载。卸载时拆下线框并写入 cache，分项页不会再跑分屏 gl.render。
 */
function resetGl(gl: WebGLRenderer) {
  gl.setScissorTest(false)
  gl.autoClear = true
}

export function SplitReveal({ split, root }: SplitRevealProps) {
  const wireRootRef = useRef<Object3D | null>(null)
  const splitRef = useRef(split)
  const gl = useThree((s) => s.gl)
  splitRef.current = split

  useEffect(() => {
    let cancelled = false
    let raf = 0
    root.visible = true
    removeOrphanWires(root, wireCache.get(root) ?? null)

    const detach = () => {
      const wire = wireRootRef.current ?? wireCache.get(root) ?? null
      if (wire) {
        wire.visible = false
        wire.removeFromParent()
        wireCache.set(root, wire)
      }
      wireRootRef.current = null
      root.visible = true
      resetGl(gl)
    }

    const cached = wireCache.get(root)
    if (cached) {
      wireRootRef.current = cached
      if (!cached.parent) root.parent?.add(cached)
      cached.visible = false
      return detach
    }

    const lineMat = new LineBasicMaterial({
      color: '#d4b56a',
      transparent: true,
      opacity: 0.88,
    })
    lineMat.userData.sharedEdgeMat = true

    const wireRoot = root.clone(true)
    wireRoot.name = WIRE_NAME
    wireRoot.visible = false

    const meshes: Mesh[] = []
    wireRoot.traverse((obj) => {
      const mesh = obj as Mesh
      if (mesh.isMesh) meshes.push(mesh)
    })

    let index = 0

    const processBatch = () => {
      if (cancelled) return

      const end = Math.min(index + EDGES_PER_FRAME, meshes.length)
      for (; index < end; index++) {
        const mesh = meshes[index]
        const parent = mesh.parent
        if (!parent || !mesh.geometry) {
          mesh.removeFromParent()
          continue
        }

        const pos = mesh.geometry.getAttribute('position')
        if (!pos || pos.count < 24) {
          mesh.removeFromParent()
          continue
        }

        const edges = new EdgesGeometry(mesh.geometry, EDGE_THRESHOLD_DEG)
        const lines = new LineSegments(edges, lineMat)
        lines.name = mesh.name || 'edges'
        lines.position.copy(mesh.position)
        lines.quaternion.copy(mesh.quaternion)
        lines.scale.copy(mesh.scale)
        lines.frustumCulled = true

        parent.add(lines)
        parent.remove(mesh)
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        for (const m of mats) m?.dispose()
      }

      if (index < meshes.length) {
        raf = requestAnimationFrame(processBatch)
        return
      }

      if (cancelled) {
        disposeWireRoot(wireRoot)
        lineMat.dispose()
        return
      }

      root.parent?.add(wireRoot)
      wireRootRef.current = wireRoot
      wireCache.set(root, wireRoot)
    }

    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(processBatch)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (wireRootRef.current) {
        detach()
      } else {
        // 构建未完成：丢弃半成品
        disposeWireRoot(wireRoot)
        lineMat.dispose()
        root.visible = true
        resetGl(gl)
      }
    }
  }, [root, gl])

  useFrame(() => {
    const wire = wireRootRef.current
    if (!wire) return
    if (interactionPerf.zooming) {
      root.visible = true
      wire.visible = false
      return
    }
    // 默认通道先藏起，由下一帧分屏绘制
    root.visible = false
    wire.visible = false
  }, -1)

  useFrame((state) => {
    const wire = wireRootRef.current
    if (!wire) {
      root.visible = true
      return
    }
    if (interactionPerf.zooming) {
      root.visible = true
      wire.visible = false
      return
    }

    const { gl, scene, camera, size } = state
    const w = size.width
    const h = size.height
    if (w < 1 || h < 1) return

    const t = splitRef.current
    const mid = Math.max(0, Math.min(w, Math.round(w * t)))

    wire.position.copy(root.position)
    wire.quaternion.copy(root.quaternion)
    wire.scale.copy(root.scale)

    gl.autoClear = false
    gl.setScissorTest(false)
    gl.setViewport(0, 0, w, h)
    gl.clear(true, true, true)

    if (mid <= 1) {
      root.visible = true
      wire.visible = false
      gl.render(scene, camera)
    } else if (mid >= w - 1) {
      root.visible = false
      wire.visible = true
      gl.render(scene, camera)
    } else {
      root.visible = false
      wire.visible = true
      gl.setScissorTest(true)
      gl.setScissor(0, 0, mid, h)
      gl.render(scene, camera)

      root.visible = true
      wire.visible = false
      gl.setScissor(mid, 0, w - mid, h)
      gl.render(scene, camera)
      gl.setScissorTest(false)
    }

    root.visible = true
    wire.visible = false
    gl.setViewport(0, 0, w, h)
    gl.autoClear = true
  }, 1)

  return null
}

function disposeWireRoot(root: Object3D) {
  const shared = new Set<LineBasicMaterial>()
  root.traverse((child) => {
    const line = child as LineSegments
    if (!line.isLineSegments) return
    line.geometry?.dispose()
    const mat = line.material as LineBasicMaterial
    if (mat?.userData?.sharedEdgeMat) {
      shared.add(mat)
    } else {
      mat?.dispose()
    }
  })
  for (const mat of shared) mat.dispose()
}
