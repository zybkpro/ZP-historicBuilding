/** 可变交互标记：缩放/拖拽时供渲染降载读取，避免 React 重渲染 */
export const interactionPerf = {
  /** 滚轮/捏合缩放中（含短暂余晖，覆盖 damping） */
  zooming: false,
  /** 指针拖拽旋转/平移中 */
  dragging: false,
  /**
   * 拖拽刚结束：OrbitControls 的 end 早于 click，
   * 用短时抑制挡住「松手误触发点击」
   */
  suppressClick: false,
}

let zoomClearTimer = 0
let suppressClickTimer = 0

/** 标记正在缩放；结束后再等 settleMs 清掉，盖住 OrbitControls damping */
export function markZooming(settleMs = 280) {
  interactionPerf.zooming = true
  window.clearTimeout(zoomClearTimer)
  zoomClearTimer = window.setTimeout(() => {
    interactionPerf.zooming = false
  }, settleMs)
}

/** 拖拽结束：短暂抑制随后的 click / pointermissed */
export function markDragEnd(suppressMs = 180) {
  interactionPerf.dragging = false
  interactionPerf.suppressClick = true
  window.clearTimeout(suppressClickTimer)
  suppressClickTimer = window.setTimeout(() => {
    interactionPerf.suppressClick = false
  }, suppressMs)
}

/** 是否应忽略画布点击/点空（缩放、拖拽中或刚松手） */
export function shouldIgnorePointerSelect() {
  return (
    interactionPerf.zooming ||
    interactionPerf.dragging ||
    interactionPerf.suppressClick
  )
}
