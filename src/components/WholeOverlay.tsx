import type { BuildingInfo } from '../data/buildings'
import { BuildingIntroPanel } from './BuildingIntroPanel'
import { PageNav } from './PageNav'

type WholeOverlayProps = {
  building: BuildingInfo
  splitReveal: number
  onSplitRevealChange: (value: number) => void
  interior: boolean
  onToggleInterior: () => void
}

export function WholeOverlay({
  building,
  splitReveal,
  onSplitRevealChange,
  interior,
  onToggleInterior,
}: WholeOverlayProps) {
  return (
    <div className="overlay is-preview">
      <PageNav />

      <BuildingIntroPanel
        building={building}
        hint="拖拽旋转 · 滚轮缩放 · 可切换内外视角 · 前往「分项展示」拆解构件"
        action={
          <button
            type="button"
            className={`panel-action-btn${interior ? ' is-active' : ''}`}
            onClick={onToggleInterior}
          >
            {interior ? '外部视角' : '内部视角'}
          </button>
        }
      />

      <div className="split-dock">
        <div className="split-meta">
          <span>线框</span>
          <span className="split-label">结构 / 外观</span>
          <span>实体</span>
        </div>
        <input
          className="split-slider"
          type="range"
          min={0}
          max={100}
          value={Math.round(splitReveal * 100)}
          onChange={(e) => onSplitRevealChange(Number(e.target.value) / 100)}
          aria-label="线框与实体分界"
        />
        <p className="preview-hint">拖拽旋转 · 滚轮缩放 · 可切换内外视角</p>
      </div>
    </div>
  )
}
