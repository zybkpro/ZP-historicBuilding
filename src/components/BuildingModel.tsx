import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { Material, Mesh, Object3D, PerspectiveCamera } from 'three'
import { Box3, Color, Group as ThreeGroup, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { findModuleByName, partModules } from '../data/parts'
import { DEFAULT_CAMERA } from '../lib/cameraView'
import { damp, layerExplodeOffsetY } from '../lib/explosion'
import { shouldIgnorePointerSelect } from '../lib/interactionPerf'
import { publicUrl } from '../lib/publicUrl'
import { PartDetailHud } from './PartDetailHud'
import { SplitReveal } from './SplitReveal'

type BuildingModelProps = {
  modelPath: string
  explode: number
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** 整体展示分屏：0 全线框 ~ 1 全实体；null 关闭 */
  splitReveal?: number | null
  /** 首次布局完成（可安全展示） */
  onReady?: () => void
}

type MeshEntry = {
  mesh: Mesh
  partId: string
  origin: Vector3
}

type ModuleRuntime = {
  id: string
  layer: number
  center: Vector3
  bounds: { min: [number, number, number]; max: [number, number, number] }
  meshes: MeshEntry[]
  baseEmissive: Map<Material, { color: Color; intensity: number }>
}

function getMaterialName(material: Mesh['material']): string {
  if (Array.isArray(material)) {
    return material.map((m) => m?.name ?? '').join(' ')
  }
  return material?.name ?? ''
}

/**
 * 正确顺序：先在本地居中，再由外层 Group 缩放。
 */
function prepareScene(source: Object3D) {
  const inner = source.clone(true)
  const matCache = new Map<Material, Material>()

  const cloneMat = (m: Material) => {
    let c = matCache.get(m)
    if (!c) {
      c = m.clone()
      c.transparent = false
      c.opacity = 1
      c.depthWrite = true
      matCache.set(m, c)
    }
    return c
  }

  inner.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = false
    mesh.receiveShadow = true
    mesh.visible = true
    mesh.frustumCulled = true
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(cloneMat)
    } else if (mesh.material) {
      mesh.material = cloneMat(mesh.material)
    }
  })

  const box = new Box3().setFromObject(inner)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const scale = 8 / maxDim

  inner.position.sub(center)

  const wrapper = new ThreeGroup()
  wrapper.name = 'building-wrapper'
  wrapper.add(inner)
  wrapper.scale.setScalar(scale)
  wrapper.position.y = (size.y * scale) / 2
  wrapper.updateMatrixWorld(true)

  return { wrapper, inner, maxDim, scale, size }
}

/** 按包围盒居中取景，沿默认外景方位拉远 */
function frameObjectBox(
  box: Box3,
  camera: PerspectiveCamera,
  controls: OrbitControlsImpl,
) {
  if (box.isEmpty()) return

  const center = box.getCenter(new Vector3())
  const size = box.getSize(new Vector3())
  const maxSize = Math.max(size.x, size.y, size.z, 0.2)
  const fov = ((camera.fov ?? 40) * Math.PI) / 180
  const fit = (maxSize / 2 / Math.tan(fov / 2)) * 1.55
  const dist = Math.max(fit, 0.6)

  const dir = new Vector3(
    DEFAULT_CAMERA.position[0] - DEFAULT_CAMERA.target[0],
    DEFAULT_CAMERA.position[1] - DEFAULT_CAMERA.target[1],
    DEFAULT_CAMERA.position[2] - DEFAULT_CAMERA.target[2],
  ).normalize()

  camera.position.copy(center).addScaledVector(dir, dist)
  controls.target.copy(center)
  controls.minDistance = Math.max(0.12, dist * 0.15)
  controls.maxDistance = Math.max(24, dist * 5)
  controls.minPolarAngle = 0.08
  controls.maxPolarAngle = Math.PI * 0.92
  controls.update()
}

function applyDefaultCamera(
  camera: PerspectiveCamera,
  controls: OrbitControlsImpl,
) {
  camera.position.set(...DEFAULT_CAMERA.position)
  if (typeof DEFAULT_CAMERA.fov === 'number') {
    camera.fov = DEFAULT_CAMERA.fov
    camera.updateProjectionMatrix()
  }
  controls.target.set(...DEFAULT_CAMERA.target)
  controls.minDistance = 0.5
  controls.maxDistance = 64
  controls.minPolarAngle = 0.12
  controls.maxPolarAngle = Math.PI * 0.88
  controls.update()
}

export function BuildingModel({
  modelPath,
  explode,
  selectedId,
  onSelect,
  splitReveal = null,
  onReady,
}: BuildingModelProps) {
  const modulesRef = useRef<ModuleRuntime[]>([])
  const amountRef = useRef(0)
  const readyRef = useRef(false)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const focusTokenRef = useRef(0)
  const prevSelectedRef = useRef<string | null>(null)

  const { camera } = useThree()
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null

  useGLTF.setDecoderPath(publicUrl('draco/'))
  const { scene } = useGLTF(modelPath, true, false)

  const { wrapper, maxDim, scale } = useMemo(() => prepareScene(scene), [scene])
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  // 选中变化时触发一次取景（等本帧爆炸位移写完）
  useEffect(() => {
    if (prevSelectedRef.current === selectedId) return
    prevSelectedRef.current = selectedId
    focusTokenRef.current += 1
  }, [selectedId])

  // 爆炸目标变化时立刻对齐；合拢时强制回到 origin，避免 amount 已到 0 却跳过写位置
  useLayoutEffect(() => {
    if (!readyRef.current) return
    const target = explode <= 0.001 ? 0 : explode
    amountRef.current = target
    const spacing = Math.max(2.6, maxDim * 0.18)
    const modules = modulesRef.current
    for (const mod of modules) {
      const dy = layerExplodeOffsetY(mod.layer, target, spacing)
      const hide = selectedId != null && selectedId !== mod.id
      for (const entry of mod.meshes) {
        entry.mesh.position.set(
          entry.origin.x,
          entry.origin.y + dy,
          entry.origin.z,
        )
        entry.mesh.visible = !hide
      }
    }
  }, [explode, selectedId, maxDim])

  useLayoutEffect(() => {
    readyRef.current = false
    // 重建索引前先撤回折开，避免把爆炸姿态写进 origin
    for (const mod of modulesRef.current) {
      for (const entry of mod.meshes) {
        entry.mesh.position.copy(entry.origin)
      }
    }
    wrapper.updateMatrixWorld(true)

    const byId = new Map<string, MeshEntry[]>()
    const unmatched: Mesh[] = []

    wrapper.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      const matName = getMaterialName(mesh.material)
      const mod = findModuleByName(mesh.name, matName)
      if (mod.id === 'details') {
        unmatched.push(mesh)
        return
      }
      mesh.userData.partId = mod.id
      const list = byId.get(mod.id) ?? []
      list.push({ mesh, partId: mod.id, origin: mesh.position.clone() })
      byId.set(mod.id, list)
    })

    const namedCenters: { id: string; center: Vector3 }[] = []
    for (const mod of partModules) {
      if (mod.id === 'details') continue
      const meshes = byId.get(mod.id)
      if (!meshes?.length) continue
      const mb = new Box3()
      for (const { mesh } of meshes) mb.expandByObject(mesh)
      namedCenters.push({ id: mod.id, center: mb.getCenter(new Vector3()) })
    }

    const snapLimit = (maxDim * 0.35) ** 2
    for (const mesh of unmatched) {
      const mb = new Box3().setFromObject(mesh)
      const mc = mb.getCenter(new Vector3())
      let bestId = 'details'
      let bestDist = Infinity
      for (const nc of namedCenters) {
        const d = mc.distanceToSquared(nc.center)
        if (d < bestDist) {
          bestDist = d
          bestId = nc.id
        }
      }
      const partId = bestDist < snapLimit ? bestId : 'details'
      mesh.userData.partId = partId
      const list = byId.get(partId) ?? []
      list.push({ mesh, partId, origin: mesh.position.clone() })
      byId.set(partId, list)
    }

    const runtimes: ModuleRuntime[] = []
    for (const mod of partModules) {
      const meshes = byId.get(mod.id)
      if (!meshes?.length) continue
      const mb = new Box3()
      for (const { mesh } of meshes) mb.expandByObject(mesh)
      const mc = mb.getCenter(new Vector3())

      const baseEmissive = new Map<Material, { color: Color; intensity: number }>()
      for (const { mesh } of meshes) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        for (const mat of mats) {
          if (!mat || baseEmissive.has(mat)) continue
          const anyMat = mat as Material & { emissive?: Color; emissiveIntensity?: number }
          if (anyMat.emissive) {
            baseEmissive.set(mat, {
              color: anyMat.emissive.clone(),
              intensity: anyMat.emissiveIntensity ?? 0,
            })
          }
        }
      }

      runtimes.push({
        id: mod.id,
        layer: mod.layer,
        center: mc,
        bounds: {
          min: [mb.min.x, mb.min.y, mb.min.z],
          max: [mb.max.x, mb.max.y, mb.max.z],
        },
        meshes,
        baseEmissive,
      })
    }

    modulesRef.current = runtimes
    readyRef.current = true
    const id = requestAnimationFrame(() => onReadyRef.current?.())
    return () => cancelAnimationFrame(id)
  }, [wrapper, maxDim])

  useFrame((_, dt) => {
    const modules = modulesRef.current
    if (!readyRef.current || !modules.length) return

    const target = explode <= 0.001 ? 0 : explode
    const prev = amountRef.current
    let amount =
      target === 0 && prev < 0.02
        ? 0
        : damp(amountRef.current, target, 10, dt)
    if (Math.abs(amount - target) < 0.0005) amount = target
    amountRef.current = amount

    const settled = amount === target && Math.abs(prev - amount) < 0.0005
    const focusToken = focusTokenRef.current
    const needFocus = focusToken > 0

    const writePositions = !settled || needFocus
    if (writePositions) {
      const spacing = Math.max(2.6, maxDim * 0.18)
      for (const mod of modules) {
        const dy = layerExplodeOffsetY(mod.layer, amount, spacing)
        const hide = selectedId != null && selectedId !== mod.id
        for (const entry of mod.meshes) {
          entry.mesh.position.set(
            entry.origin.x,
            entry.origin.y + dy,
            entry.origin.z,
          )
          entry.mesh.visible = !hide
        }
      }
    } else if (selectedId != null) {
      for (const mod of modules) {
        const hide = mod.id !== selectedId
        for (const { mesh } of mod.meshes) mesh.visible = !hide
      }
    }

    if (!needFocus) return
    focusTokenRef.current = 0

    const persp = camera as PerspectiveCamera
    if (!controls || !persp.isPerspectiveCamera) return

    if (!selectedId) {
      applyDefaultCamera(persp, controls)
      return
    }

    const mod = modules.find((m) => m.id === selectedId)
    if (!mod) return

    wrapper.updateMatrixWorld(true)
    const box = new Box3()
    for (const { mesh } of mod.meshes) {
      if (!mesh.visible) continue
      box.expandByObject(mesh)
    }
    frameObjectBox(box, persp, controls)
  })

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        // 缩放/旋转中或刚松手时忽略，避免拖拽结束误触发点击
        if (shouldIgnorePointerSelect()) return
        // 已在单独查看某分项时，画布点击不再切换到其他分项
        if (selectedId != null) return

        let obj = e.object
        let id = obj.userData.partId as string | undefined
        while (!id && obj.parent) {
          obj = obj.parent
          id = obj.userData.partId as string | undefined
        }
        if (id) onSelect(id)
      }}
    >
      <primitive object={wrapper} />
      {/* 仅整体页挂载：卸载后分屏渲染停止，线框进模块缓存 */}
      {splitReveal != null && (
        <SplitReveal split={splitReveal} root={wrapper} />
      )}
      {selectedId != null && splitReveal == null && (
        <PartDetailHud
          selectedId={selectedId}
          modulesRef={modulesRef}
          onClose={() => onSelect(null)}
        />
      )}
    </group>
  )
}

useGLTF.setDecoderPath(publicUrl('draco/'))
useGLTF.preload(publicUrl('models/chinese-architecture.glb'), true, false)
