import { useEffect, useState } from 'react'
import GUI from 'lil-gui'
import { DEFAULT_ENV, type EnvSettings } from '../lib/envSettings'

/**
 * lil-gui 环境面板：返回可驱动场景的实时参数。
 */
export function useEnvGui(enabled = true) {
  const [env, setEnv] = useState<EnvSettings>(() => ({ ...DEFAULT_ENV }))

  useEffect(() => {
    if (!enabled) return

    const params: EnvSettings = { ...DEFAULT_ENV }
    const gui = new GUI({ title: '环境设置', width: 300 })
    gui.domElement.style.position = 'fixed'
    gui.domElement.style.top = '72px'
    gui.domElement.style.right = '12px'
    gui.domElement.style.zIndex = '20'

    const sync = () => setEnv({ ...params })

    const bg = gui.addFolder('背景 / 雾')
    bg.addColor(params, 'bgColor').name('背景色').onChange(sync)
    bg.add(params, 'fogEnabled').name('启用雾').onChange(sync)
    bg.addColor(params, 'fogColor').name('雾颜色').onChange(sync)
    bg.add(params, 'fogNear', 1, 80, 0.5).name('雾近').onChange(sync)
    bg.add(params, 'fogFar', 5, 120, 0.5).name('雾远').onChange(sync)
    bg.open()

    const ambient = gui.addFolder('环境光')
    ambient.add(params, 'ambientIntensity', 0, 3, 0.01).name('强度').onChange(sync)
    ambient.addColor(params, 'ambientColor').name('颜色').onChange(sync)
    ambient.add(params, 'hemiIntensity', 0, 3, 0.01).name('半球强度').onChange(sync)
    ambient.addColor(params, 'hemiSky').name('天空色').onChange(sync)
    ambient.addColor(params, 'hemiGround').name('地面色').onChange(sync)
    ambient.open()

    const sun = gui.addFolder('主光（阳光）')
    sun.add(params, 'sunIntensity', 0, 5, 0.01).name('强度').onChange(sync)
    sun.addColor(params, 'sunColor').name('颜色').onChange(sync)
    sun.add(params, 'sunX', -30, 30, 0.1).name('位置 X').onChange(sync)
    sun.add(params, 'sunY', 0, 40, 0.1).name('位置 Y').onChange(sync)
    sun.add(params, 'sunZ', -30, 30, 0.1).name('位置 Z').onChange(sync)
    sun.add(params, 'sunCastShadow').name('投射阴影').onChange(sync)
    sun.open()

    const fill = gui.addFolder('辅光')
    fill.add(params, 'fillIntensity', 0, 3, 0.01).name('强度').onChange(sync)
    fill.addColor(params, 'fillColor').name('颜色').onChange(sync)
    fill.add(params, 'fillX', -30, 30, 0.1).name('位置 X').onChange(sync)
    fill.add(params, 'fillY', 0, 40, 0.1).name('位置 Y').onChange(sync)
    fill.add(params, 'fillZ', -30, 30, 0.1).name('位置 Z').onChange(sync)

    const rim = gui.addFolder('轮廓光')
    rim.add(params, 'rimIntensity', 0, 3, 0.01).name('强度').onChange(sync)
    rim.addColor(params, 'rimColor').name('颜色').onChange(sync)
    rim.add(params, 'rimX', -30, 30, 0.1).name('位置 X').onChange(sync)
    rim.add(params, 'rimY', 0, 40, 0.1).name('位置 Y').onChange(sync)
    rim.add(params, 'rimZ', -30, 30, 0.1).name('位置 Z').onChange(sync)

    const shadow = gui.addFolder('接触阴影')
    shadow.add(params, 'shadowOpacity', 0, 1, 0.01).name('不透明度').onChange(sync)
    shadow.add(params, 'shadowBlur', 0, 8, 0.1).name('模糊').onChange(sync)
    shadow.add(params, 'shadowScale', 5, 80, 0.5).name('范围').onChange(sync)
    shadow.add(params, 'shadowFar', 1, 40, 0.5).name('Far').onChange(sync)

    gui
      .add(
        {
          reset: () => {
            Object.assign(params, DEFAULT_ENV)
            gui.controllersRecursive().forEach((c) => c.updateDisplay())
            sync()
          },
        },
        'reset',
      )
      .name('恢复默认')

    sync()

    return () => {
      gui.destroy()
    }
  }, [enabled])

  return env
}
