export type Bounds = {
  min: [number, number, number]
  max: [number, number, number]
}

export type PackPart = {
  id: string
  bounds: Bounds
}

export type LayoutCell = {
  x: number
  y: number
  width: number
  height: number
}

/** 将可见模块按 XY 投影尺寸货架式装箱（整体模式等备用） */
export function createExplosionLayout(parts: PackPart[], aspect = 1) {
  const cards = parts.map((p) => ({
    id: p.id,
    width: Math.max(0.6, p.bounds.max[0] - p.bounds.min[0]) + 0.45,
    height: Math.max(0.6, p.bounds.max[1] - p.bounds.min[1]) + 0.45,
  }))

  const area = cards.reduce((n, c) => n + c.width * c.height, 0)
  const maxWidth = Math.max(1.2, ...cards.map((c) => c.width))
  const targetWidth = Math.max(
    maxWidth,
    Math.sqrt(area * Math.max(0.5, Math.min(1.6, aspect))) * 1.15,
  )

  cards.sort((a, b) => b.height - a.height || a.id.localeCompare(b.id))

  const cells = new Map<string, LayoutCell>()
  let x = 0
  let y = 0
  let row = 0
  let usedWidth = 0

  for (const c of cards) {
    if (x > 0 && x + c.width > targetWidth) {
      x = 0
      y += row
      row = 0
    }
    cells.set(c.id, {
      x: x + c.width / 2,
      y: -y - c.height / 2,
      width: c.width,
      height: c.height,
    })
    x += c.width
    usedWidth = Math.max(usedWidth, x)
    row = Math.max(row, c.height)
  }

  const height = y + row
  cells.forEach((c) => {
    c.x -= usedWidth / 2
    c.y += height / 2
  })

  return { cells, width: usedWidth, height }
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

/** 五层爆炸：第 layer 层相对中间层的额外抬升（模型局部单位） */
export function layerExplodeOffsetY(
  layer: number,
  amount: number,
  spacing: number,
  layerCount = 5,
) {
  const mid = (layerCount - 1) / 2
  return (layer - mid) * spacing * amount
}
