# 中国古建筑 · 三维拆解科普

[![GitHub stars](https://img.shields.io/github/stars/zybkpro/ZP-historicBuilding?style=social)](https://github.com/zybkpro/ZP-historicBuilding/stargazers)
[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-53c9ff)](https://zybkpro.github.io/ZP-historicBuilding/)

> **关键词：** 中国古建筑 · 三维拆解 · 万法归一殿 · 斗拱 · 木构营造 · Three.js · React Three Fiber

基于 **React + Vite + Three.js（React Three Fiber）** 的中国古建筑互动科普站：整体浏览、分项讲解、五层爆炸拆解与构件图文导览。

**素材来源：** [ZYBK Pro · 素材中心](https://www.zybkpro.top/material)（GLB 模型、HDR、大屏组件等）

## 在线演示

- [GitHub Pages](https://zybkpro.github.io/ZP-historicBuilding/)
- [自有域名](https://www.zybkpro.top/threejs/historicBuilding/)（Nginx 部署）

## 预览

![中国古建筑三维拆解科普预览](./docs/preview.png)

[▶ 在线体验：GitHub Pages 演示](https://zybkpro.github.io/ZP-historicBuilding/)

## 适用场景

- 古建 / 文博数字化展示与科普教学
- Three.js 爆炸视图、构件高亮与 keep-alive 场景切换参考
- 数字孪生、文旅大屏中的木构建筑互动模块

## 技术栈

- React 19 + TypeScript
- Vite 8
- three.js
- `@react-three/fiber` / `@react-three/drei`
- React Router

## 开始

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可。

## 爆炸拆解与科普

交互参考人体模型项目的两阶段爆炸：

1. **0–45%**：按模块径向散开（台基、柱网、梁架、斗栱…）
2. **45–100%**：收拢为平面「构件清单」布局

左侧可点选模块阅读营造科普；也可直接点击 3D 模型。下方滑杆控制爆炸程度，并提供「复位 / 分离 / 清单」快捷按钮。

模块文案见 `src/data/parts.ts`，右侧导览图见 `src/data/partGuides.ts`。

## 模型压缩

原始模型约 **236MB**，已用 glTF-Transform 压缩为约 **20MB**（仓库内为 Web 用 GLB）：

| 步骤 | 说明 |
| --- | --- |
| Draco | 网格几何压缩 |
| WebP | 贴图转 WebP，最长边 ≤ 2048 |
| Simplify | 在误差阈值内减面 |

重新压缩（需本地保留源文件）：

```bash
npm run compress:model
```

源文件：`public/models/source/chinese-architecture.original.glb`  
输出：`public/models/chinese-architecture.glb`

## 部署

### GitHub Pages

`https://zybkpro.github.io/ZP-historicBuilding/`

推送到 `main` 后 Actions 自动部署；Settings → Pages → Source = **GitHub Actions**。

### Nginx 子目录

构建产物 `dist/` 可部署到例如 `/usr/share/nginx/html/threejs/historicBuilding`。  
`vite.config` 使用 `base: './'`，相对路径可同时适配 Pages 与子目录。

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run compress:model` | 从源文件重新压缩模型 |

## Star

如果这个项目对你有帮助，欢迎点个 **Star** ⭐ 支持一下。
