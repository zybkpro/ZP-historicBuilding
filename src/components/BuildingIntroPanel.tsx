import type { ReactNode } from 'react'
import type { BuildingInfo } from '../data/buildings'

type BuildingIntroPanelProps = {
  building: BuildingInfo
  hint: string
  /** 弹窗右上角操作区（如内部视角） */
  action?: ReactNode
}

/** 右上角殿宇介绍：整体页 / 分项页共用 */
export function BuildingIntroPanel({
  building,
  hint,
  action,
}: BuildingIntroPanelProps) {
  return (
    <aside className="overlay-panel is-top-right">
      {action && <div className="panel-action">{action}</div>}
      <p className="era">{building.era}</p>
      <h1>{building.name}</h1>
      <p className="summary">{building.summary}</p>
      {building.coverImage && (
        <figure className="panel-cover">
          <img
            src={building.coverImage}
            alt={`${building.name}配图`}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      <p className="detail-body">{building.detail}</p>
      <p className="hint">{hint}</p>
    </aside>
  )
}
