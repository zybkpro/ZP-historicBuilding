import { useState } from 'react'
import type { BuildingInfo } from '../data/buildings'
import { explodeLayers, getModuleById, modulesInLayer } from '../data/parts'
import { BuildingIntroPanel } from './BuildingIntroPanel'
import { PartGuidePanel } from './PartGuidePanel'
import { PageNav } from './PageNav'

type PartsOverlayProps = {
  building: BuildingInfo
  explode: number
  onExplodeChange: (value: number) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  onCopyCamera: () => void | Promise<void>
}

export function PartsOverlay({
  building,
  explode,
  onExplodeChange,
  selectedId,
  onSelect,
  onCopyCamera,
}: PartsOverlayProps) {
  const selected = getModuleById(selectedId)
  const explodeLabel =
    explode > 0.95 ? '五层展开' : explode > 0.05 ? '分层分离' : '完整殿宇'
  const [copiedTip, setCopiedTip] = useState(false)

  const handleCopy = async () => {
    await onCopyCamera()
    setCopiedTip(true)
    window.setTimeout(() => setCopiedTip(false), 1600)
  }

  return (
    <div className="overlay is-parts">
      <PageNav />

      <div className="overlay-body">
        <aside className="module-rail" aria-label="建筑分层模块">
          <p className="rail-title">五层拆解</p>
          {[...explodeLayers].reverse().map((layer) => {
            const mods = modulesInLayer(layer.layer)
            if (!mods.length) return null
            return (
              <div key={layer.layer} className="layer-group">
                <p className="layer-label">
                  <span className="layer-index">L{layer.layer + 1}</span>
                  {layer.name}
                  <span className="layer-sub">{layer.subtitle}</span>
                </p>
                <ul className="module-list">
                  {mods.map((mod) => {
                    const active = selectedId === mod.id
                    return (
                      <li key={mod.id}>
                        <button
                          type="button"
                          className={`module-item${active ? ' is-active' : ''}`}
                          onClick={() => onSelect(active ? null : mod.id)}
                        >
                          <span
                            className="module-dot"
                            style={{ background: mod.color }}
                          />
                          <span className="module-text">
                            <span className="module-name">{mod.name}</span>
                            <span className="module-sub">{mod.subtitle}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </aside>

        {!selected && (
          <BuildingIntroPanel
            building={building}
            hint="爆炸视图按台基 → 殿身 → 腰檐 → 斗拱 → 屋面上下五层拉开"
          />
        )}

        {selected && (
          <PartGuidePanel
            selectedId={selected.id}
            onClose={() => onSelect(null)}
          />
        )}

        <div className="overlay-main">
          <div className="explode-dock">
            <div className="explode-meta">
              <span>爆炸视图</span>
              <span className="explode-state">{explodeLabel}</span>
              <span className="explode-pct">{Math.round(explode * 100)}%</span>
            </div>
            <input
              className="explode-slider"
              type="range"
              min={0}
              max={100}
              value={Math.round(explode * 100)}
              onChange={(e) => onExplodeChange(Number(e.target.value) / 100)}
              aria-label="五层爆炸拆解程度"
            />
            <div className="explode-actions">
              <button type="button" onClick={() => onExplodeChange(0)}>
                合拢
              </button>
              <button type="button" onClick={() => onExplodeChange(0.55)}>
                分层
              </button>
              <button type="button" onClick={() => onExplodeChange(1)}>
                展开
              </button>
            </div>
          </div>
        </div>
      </div>

      {!selected && (
        <div className="camera-tools">
          <button
            type="button"
            className={`camera-tool-btn save-camera-btn${copiedTip ? ' is-saved' : ''}`}
            onClick={() => {
              void handleCopy()
            }}
          >
            {copiedTip ? '视角已复制' : '复制视角'}
          </button>
        </div>
      )}
    </div>
  )
}
