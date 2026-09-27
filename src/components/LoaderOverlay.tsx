import { useProgress } from '@react-three/drei'

type LoaderOverlayProps = {
  /** 场景侧确认模型已挂载并完成首次准备 */
  modelReady: boolean
}

/** 下载中或模型尚未就绪时都显示，避免「进度条消失 → 线框方块空等」 */
export function LoaderOverlay({ modelReady }: LoaderOverlayProps) {
  const { active, progress, loaded, total } = useProgress()
  const downloading = active || (total > 0 && loaded < total)
  const show = !modelReady || downloading

  if (!show) return null

  const pct = modelReady
    ? 100
    : downloading
      ? Math.min(progress, 99)
      : Math.max(progress, 12)

  const label = downloading ? '模型加载中' : '场景准备中'
  const tip = downloading
    ? '模型约 20MB，首次加载请稍候'
    : '正在解析几何与材质，请稍候'

  return (
    <div className="loader" role="status" aria-live="polite">
      <p className="loader-label">{label}</p>
      <div className="loader-bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="loader-meta">
        {Math.round(pct)}%
        {downloading && total > 0 ? ` · ${loaded}/${total}` : ''}
      </p>
      <p className="loader-tip">{tip}</p>
    </div>
  )
}
