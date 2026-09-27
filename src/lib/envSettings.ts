/** 场景环境默认参数 */
export type EnvSettings = {
  bgColor: string
  fogEnabled: boolean
  fogColor: string
  fogNear: number
  fogFar: number

  ambientIntensity: number
  ambientColor: string
  hemiIntensity: number
  hemiSky: string
  hemiGround: string

  sunIntensity: number
  sunColor: string
  sunX: number
  sunY: number
  sunZ: number
  sunCastShadow: boolean

  fillIntensity: number
  fillColor: string
  fillX: number
  fillY: number
  fillZ: number

  rimIntensity: number
  rimColor: string
  rimX: number
  rimY: number
  rimZ: number

  shadowOpacity: number
  shadowBlur: number
  shadowScale: number
  shadowFar: number
}

/** 按调好的 GUI 参数固化 */
export const DEFAULT_ENV: EnvSettings = {
  bgColor: '#4e361d',
  fogEnabled: false,
  fogColor: '#7f6953',
  fogNear: 1,
  fogFar: 30.5,

  ambientIntensity: 0.82,
  ambientColor: '#f2ebe0',
  hemiIntensity: 3,
  hemiSky: '#f2ebe0',
  hemiGround: '#2a2218',

  sunIntensity: 4.06,
  sunColor: '#ffffff',
  sunX: 8,
  sunY: 14,
  sunZ: 6,
  sunCastShadow: false,

  fillIntensity: 0.66,
  fillColor: '#c4a35a',
  fillX: -6,
  fillY: 4,
  fillZ: -8,

  rimIntensity: 0.5,
  rimColor: '#f2ebe0',
  rimX: 0,
  rimY: 6,
  rimZ: -10,

  shadowOpacity: 0,
  shadowBlur: 0,
  shadowScale: 5,
  shadowFar: 1,
}
