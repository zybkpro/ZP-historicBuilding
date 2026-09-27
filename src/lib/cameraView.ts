export type CameraView = {
  position: [number, number, number]
  target: [number, number, number]
  fov?: number
}

const PREFIX = 'zybkpro-historic-building:camera:'

export function cameraStorageKey(mode: 'whole' | 'parts') {
  return `${PREFIX}${mode}`
}

export function loadCameraView(mode: 'whole' | 'parts'): CameraView | null {
  try {
    const raw = localStorage.getItem(cameraStorageKey(mode))
    if (!raw) return null
    const data = JSON.parse(raw) as CameraView
    if (
      !Array.isArray(data.position) ||
      data.position.length !== 3 ||
      !Array.isArray(data.target) ||
      data.target.length !== 3
    ) {
      return null
    }
    return data
  } catch {
    return null
  }
}

export function saveCameraView(mode: 'whole' | 'parts', view: CameraView) {
  localStorage.setItem(cameraStorageKey(mode), JSON.stringify(view))
}

/** 殿外整体预览 */
export const DEFAULT_CAMERA: CameraView = {
  position: [0.10139546058533697, 1.8614079191908033, 8.480381172838495],
  target: [0.03750399989666672, 1.3368737843692031, 0.1433946609844633],
  fov: 40,
}

/** 建筑内部视角 */
export const INTERIOR_CAMERA: CameraView = {
  position: [0.34984601646185687, 1.4950281780356158, -0.4375230306553248],
  target: [0.04027203083248507, 1.4526812071458979, 0.15094349945476332],
  fov: 40,
}
