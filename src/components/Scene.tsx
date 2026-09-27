import { Canvas, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import {
  forwardRef,
  Suspense,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { BuildingModel } from './BuildingModel'
import { LoaderOverlay } from './LoaderOverlay'
import {
  DEFAULT_CAMERA,
  INTERIOR_CAMERA,
  type CameraView,
} from '../lib/cameraView'
import {
  interactionPerf,
  markDragEnd,
  markZooming,
  shouldIgnorePointerSelect,
} from '../lib/interactionPerf'
import type { EnvSettings } from '../lib/envSettings'
import type { ViewMode } from '../lib/viewMode'

const INTERIOR_LIMITS = {
  minDistance: 0.12,
  maxDistance: 8,
  minPolar: 0.08,
  /** 接近仰视，才能看到殿内天花/藻井 */
  maxPolar: Math.PI * 0.92,
}

export type SceneApi = {
  getCamera: () => CameraView | null
  setCamera: (view: CameraView, options?: { interior?: boolean }) => void
}

type SceneProps = {
  modelPath: string
  viewMode: ViewMode
  explode: number
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** 仅整体模式使用；分项模式传 null */
  splitReveal: number | null
  env: EnvSettings
  interior?: boolean
}

const CAM = {
  minDistance: 0.5,
  maxDistance: 36,
  maxDistanceExploded: 64,
  minPolar: 0.12,
  /** 略高于水平，便于仰望檐下与室内顶部 */
  maxPolar: Math.PI * 0.78,
  /** 分项拆解时更松，方便看各层顶面 */
  maxPolarParts: Math.PI * 0.88,
}
 
function applyView(
  controls: OrbitControlsImpl,
  view: CameraView,
  camera: ThreePerspectiveCamera,
) {
  camera.position.set(...view.position)
  if (typeof view.fov === 'number') {
    camera.fov = view.fov
    camera.updateProjectionMatrix()
  }
  controls.target.set(...view.target)
  controls.update()
}

function CameraBinder({
  viewMode,
  explode,
  interior,
  selectedId,
  controlsRef,
  apiRef,
}: {
  viewMode: ViewMode
  explode: number
  interior: boolean
  selectedId: string | null
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  apiRef: React.MutableRefObject<SceneApi | null>
}) {
  const { camera } = useThree()
  const exploded = explode > 0.45
  const maxDist = exploded ? CAM.maxDistanceExploded : CAM.maxDistance
  const focusingPart = selectedId != null

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || !(camera as ThreePerspectiveCamera).isPerspectiveCamera) return

    const persp = camera as ThreePerspectiveCamera
    controls.enableRotate = true
    const maxPolar =
      viewMode === 'parts' ? CAM.maxPolarParts : CAM.maxPolar

    if (interior) {
      controls.minDistance = INTERIOR_LIMITS.minDistance
      controls.maxDistance = INTERIOR_LIMITS.maxDistance
      controls.minPolarAngle = INTERIOR_LIMITS.minPolar
      controls.maxPolarAngle = INTERIOR_LIMITS.maxPolar
      applyView(controls, INTERIOR_CAMERA, persp)
    } else {
      controls.minDistance = CAM.minDistance
      controls.maxDistance = maxDist
      controls.minPolarAngle = CAM.minPolar
      controls.maxPolarAngle = maxPolar
      // 分项已选中时不要重置视角，否则放大中会被拽走
      if (!focusingPart) {
        applyView(controls, DEFAULT_CAMERA, persp)
      }
    }
  }, [viewMode, interior])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || interior) return
    const maxPolar =
      viewMode === 'parts' ? CAM.maxPolarParts : CAM.maxPolar
    // 单独查看某分项时保留取景时的近远裁，避免放大被突然夹回
    if (!focusingPart) {
      controls.minDistance = CAM.minDistance
      controls.maxDistance = maxDist
      controls.minPolarAngle = CAM.minPolar
      controls.maxPolarAngle = maxPolar
    }
    controls.enableRotate = true
    controls.update()
  }, [explode, maxDist, controlsRef, interior, viewMode, focusingPart])

  useEffect(() => {
    apiRef.current = {
      getCamera: () => {
        const controls = controlsRef.current
        if (!controls || !(camera as ThreePerspectiveCamera).isPerspectiveCamera) {
          return null
        }
        const persp = camera as ThreePerspectiveCamera
        return {
          position: [persp.position.x, persp.position.y, persp.position.z],
          target: [controls.target.x, controls.target.y, controls.target.z],
          fov: persp.fov,
        }
      },
      setCamera: (view, options) => {
        const controls = controlsRef.current
        if (!controls || !(camera as ThreePerspectiveCamera).isPerspectiveCamera) {
          return
        }
        const persp = camera as ThreePerspectiveCamera
        if (options?.interior) {
          controls.minDistance = INTERIOR_LIMITS.minDistance
          controls.maxDistance = INTERIOR_LIMITS.maxDistance
          controls.minPolarAngle = INTERIOR_LIMITS.minPolar
          controls.maxPolarAngle = INTERIOR_LIMITS.maxPolar
        } else {
          const maxPolar =
            viewMode === 'parts' ? CAM.maxPolarParts : CAM.maxPolar
          controls.minDistance = CAM.minDistance
          controls.maxDistance = maxDist
          controls.minPolarAngle = CAM.minPolar
          controls.maxPolarAngle = maxPolar
        }
        applyView(controls, view, persp)
      },
    }
    return () => {
      apiRef.current = null
    }
  }, [apiRef, camera, controlsRef, viewMode, maxDist])

  return null
}

/** 仅标记缩放状态，并区分「真拖拽」与「单击」 */
function InteractionPerfBridge() {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const lastDistRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0, moved: false, active: false })

  useEffect(() => {
    const el = gl.domElement
    const onWheel = () => markZooming(280)
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [gl])

  useEffect(() => {
    const el = gl.domElement
    const onDown = (e: PointerEvent) => {
      pointerRef.current = {
        x: e.clientX,
        y: e.clientY,
        moved: false,
        active: true,
      }
      interactionPerf.suppressClick = false
    }
    const onMove = (e: PointerEvent) => {
      const p = pointerRef.current
      if (!p.active || p.moved) return
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 5) {
        p.moved = true
        interactionPerf.dragging = true
      }
    }
    const onUp = () => {
      const p = pointerRef.current
      if (p.active && p.moved) {
        markDragEnd(200)
      } else {
        interactionPerf.dragging = false
      }
      p.active = false
      p.moved = false
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  useEffect(() => {
    const ctrl = controls as OrbitControlsImpl | null
    if (!ctrl?.addEventListener) return
    lastDistRef.current = camera.position.distanceTo(ctrl.target)

    // 触控捏合等非 wheel 的 dolly
    const onChange = () => {
      const dist = camera.position.distanceTo(ctrl.target)
      if (Math.abs(dist - lastDistRef.current) > 1e-4) {
        markZooming(280)
      }
      lastDistRef.current = dist
    }
    ctrl.addEventListener('change', onChange)
    return () => {
      ctrl.removeEventListener('change', onChange)
    }
  }, [controls, camera])

  return null
}

function SceneFog({ env, exploded }: { env: EnvSettings; exploded: boolean }) {
  const far = exploded ? Math.max(env.fogFar, 90) : env.fogFar
  const near = exploded ? Math.max(env.fogNear, far * 0.45) : env.fogNear

  if (!env.fogEnabled) return null
  return <fog attach="fog" args={[env.fogColor, near, far]} />
}

export const Scene = forwardRef<SceneApi, SceneProps>(function Scene(
  { modelPath, viewMode, explode, selectedId, onSelect, splitReveal, env, interior = false },
  ref,
) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const apiRef = useRef<SceneApi | null>(null)
  const [modelReady, setModelReady] = useState(false)
  const exploded = explode > 0.45
  const farFog = env.fogEnabled
    ? exploded
      ? Math.max(env.fogFar, 90)
      : env.fogFar
    : 120
  const initial = DEFAULT_CAMERA
  const isWhole = viewMode === 'whole'
  const shadowOpacity = explode > 0.35 ? env.shadowOpacity * 0.5 : env.shadowOpacity

  useEffect(() => {
    setModelReady(false)
  }, [modelPath])

  // 切页后强制推进一帧，避免仍停在整体分屏的最后一帧
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // Canvas 默认 always 循环；此处仅保证控件/可见性变更后立刻刷新
      controlsRef.current?.update()
    })
    return () => cancelAnimationFrame(id)
  }, [viewMode, explode, splitReveal])

  useImperativeHandle(ref, () => ({
    getCamera: () => apiRef.current?.getCamera() ?? null,
    setCamera: (view, options) => {
      apiRef.current?.setCamera(view, options)
    },
  }))

  return (
    <div className="scene-root">
      <Canvas
        shadows={!isWhole}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onPointerMissed={() => {
          if (shouldIgnorePointerSelect()) return
          onSelect(null)
        }}
      >
        <color attach="background" args={[env.bgColor]} />
        <SceneFog env={env} exploded={exploded} />

        <PerspectiveCamera
          makeDefault
          position={initial.position}
          fov={initial.fov ?? 40}
          near={0.1}
          far={farFog + 40}
        />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={CAM.minDistance}
          maxDistance={CAM.maxDistance}
          minPolarAngle={CAM.minPolar}
          maxPolarAngle={CAM.maxPolar}
          target={initial.target}
          zoomSpeed={0.85}
          rotateSpeed={0.85}
        />

        <InteractionPerfBridge />
        <CameraBinder
          viewMode={viewMode}
          explode={explode}
          interior={interior}
          selectedId={selectedId}
          controlsRef={controlsRef}
          apiRef={apiRef}
        />

        <hemisphereLight
          args={[env.hemiSky, env.hemiGround, env.hemiIntensity]}
        />
        <ambientLight intensity={env.ambientIntensity} color={env.ambientColor} />
        <directionalLight
          castShadow={!isWhole && env.sunCastShadow}
          position={[env.sunX, env.sunY, env.sunZ]}
          intensity={env.sunIntensity}
          color={env.sunColor}
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[env.fillX, env.fillY, env.fillZ]}
          intensity={env.fillIntensity}
          color={env.fillColor}
        />
        <directionalLight
          position={[env.rimX, env.rimY, env.rimZ]}
          intensity={env.rimIntensity}
          color={env.rimColor}
        />

        <Suspense fallback={null}>
          <BuildingModel
            modelPath={modelPath}
            explode={explode}
            selectedId={selectedId}
            onSelect={onSelect}
            splitReveal={isWhole ? (splitReveal ?? 0.5) : null}
            onReady={() => setModelReady(true)}
          />
          {!isWhole && env.shadowOpacity > 0.01 && (
            <ContactShadows
              key={`shadow-${Math.round(explode * 20)}`}
              frames={1}
              resolution={512}
              position={[0, 0.01, 0]}
              opacity={shadowOpacity}
              scale={env.shadowScale}
              blur={env.shadowBlur}
              far={env.shadowFar}
            />
          )}
        </Suspense>
      </Canvas>

      <LoaderOverlay modelReady={modelReady} />
    </div>
  )
})
