import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group, Mesh } from 'three'
import { Box3, Vector3 } from 'three'
import { explodeLayers, getModuleById } from '../data/parts'

type AnchorModule = {
  id: string
  meshes: { mesh: Mesh }[]
}

type PartDetailHudProps = {
  selectedId: string
  modulesRef: React.RefObject<AnchorModule[]>
  /** 保留接口；关闭改由侧栏取消选中 */
  onClose: () => void
}

const _box = new Box3()
const _center = new Vector3()
const _size = new Vector3()

/**
 * 圆形锚点 + 右侧字段面板（主题金/墨色科技 HUD）
 */
export function PartDetailHud({
  selectedId,
  modulesRef,
}: PartDetailHudProps) {
  const rootRef = useRef<Group>(null)
  const selected = getModuleById(selectedId)

  const layerMeta = useMemo(() => {
    if (!selected) return null
    return explodeLayers.find((l) => l.layer === selected.layer) ?? null
  }, [selected])

  const rows = useMemo(() => {
    if (!selected || !layerMeta) return []
    return [
      { label: '所属层级', value: `L${selected.layer + 1} ${layerMeta.name}` },
      { label: '层级说明', value: layerMeta.subtitle },
      { label: '构造要点', value: selected.subtitle },
      { label: '模块标识', value: selected.id.toUpperCase() },
    ]
  }, [selected, layerMeta])

  useFrame(() => {
    const root = rootRef.current
    if (!root) return

    const mod = modulesRef.current.find((m) => m.id === selectedId)
    if (!mod?.meshes.length) {
      root.visible = false
      return
    }

    _box.makeEmpty()
    for (const { mesh } of mod.meshes) {
      if (!mesh.visible) continue
      _box.expandByObject(mesh)
    }
    if (_box.isEmpty()) {
      root.visible = false
      return
    }

    _box.getCenter(_center)
    _box.getSize(_size)
    root.visible = true
    // 锚在构件顶面略上方；Html 底边对齐该点，整块上浮不压模型
    const lift = Math.max(0.35, _size.y * 0.06 + 0.25)
    root.position.set(_center.x, _box.max.y + lift, _center.z)
  })

  if (!selected) return null

  return (
    <group ref={rootRef}>
      <Html
        style={{
          pointerEvents: 'none',
          transform: 'translate3d(-50%, -100%, 0)',
        }}
        zIndexRange={[120, 0]}
      >
        <div
          className="part-hud"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="part-hud-orb">
            <svg className="part-hud-orb-rings" viewBox="0 0 120 120" aria-hidden>
              <circle className="is-glow" cx="60" cy="60" r="56" />
              <circle className="is-outer" cx="60" cy="60" r="54" />
              <circle className="is-dash" cx="60" cy="60" r="46" />
              <circle className="is-fill" cx="60" cy="60" r="40" />
            </svg>
            <div className="part-hud-orb-text">
              <span className="part-hud-orb-zh">{selected.name}</span>
              <span className="part-hud-orb-en">{selected.id}</span>
            </div>
          </div>

          <aside className="part-hud-panel">
            <ul className="part-hud-rows">
              {rows.map((row) => (
                <li key={row.label} className="part-hud-row">
                  <span className="part-hud-tri" aria-hidden />
                  <span className="part-hud-row-label">{row.label}</span>
                  <span className="part-hud-row-value">{row.value}</span>
                </li>
              ))}
            </ul>
            <p className="part-hud-summary">{selected.summary}</p>
          </aside>
        </div>
      </Html>
    </group>
  )
}
