import type { SceneApi } from '../components/Scene'

export async function copyCameraJson(api: SceneApi | null) {
  const view = api?.getCamera()
  if (!view) return
  const text = JSON.stringify(view)
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    window.prompt('复制视角 JSON：', text)
  }
}
