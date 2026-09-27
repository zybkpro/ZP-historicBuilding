import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PartsOverlay } from '../components/PartsOverlay'
import { Scene, type SceneApi } from '../components/Scene'
import { WholeOverlay } from '../components/WholeOverlay'
import { buildings } from '../data/buildings'
import { copyCameraJson } from '../lib/copyCamera'
import { DEFAULT_ENV } from '../lib/envSettings'

/**
 * KeepAlive：
 * - 单一 Canvas 常挂，避免 WebGL 上下文反复销毁
 * - 整体/分项 Overlay 都挂载，仅显隐切换，状态互不影响
 * - 线框与爆炸姿态在场景侧缓存/瞬切，避免切页后久等重建
 */
export default function ExperienceLayout() {
  const building = buildings[0]
  const sceneRef = useRef<SceneApi>(null)
  const { pathname } = useLocation()
  const isParts = pathname.startsWith('/parts')

  // 整体页状态
  const [splitReveal, setSplitReveal] = useState(0.5)
  const [interior, setInterior] = useState(false)

  // 分项页状态
  const [explode, setExplode] = useState(0.55)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <main className="app">
      <Scene
        ref={sceneRef}
        modelPath={building.modelPath}
        viewMode={isParts ? 'parts' : 'whole'}
        explode={isParts ? explode : 0}
        selectedId={isParts ? selectedId : null}
        splitReveal={isParts ? null : splitReveal}
        env={DEFAULT_ENV}
        interior={!isParts && interior}
        onSelect={isParts ? setSelectedId : () => {}}
      />

      <div
        className={`page-keep${isParts ? ' is-active' : ''}`}
        aria-hidden={!isParts}
      >
        <PartsOverlay
          building={building}
          explode={explode}
          onExplodeChange={setExplode}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCopyCamera={() => copyCameraJson(sceneRef.current)}
        />
      </div>

      <div
        className={`page-keep${isParts ? '' : ' is-active'}`}
        aria-hidden={isParts}
      >
        <WholeOverlay
          building={building}
          splitReveal={splitReveal}
          onSplitRevealChange={setSplitReveal}
          interior={interior}
          onToggleInterior={() => {
            if (interior) {
              setInterior(false)
              return
            }
            setSplitReveal(1)
            setInterior(true)
          }}
        />
      </div>
    </main>
  )
}
