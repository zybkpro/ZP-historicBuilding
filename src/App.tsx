import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ExperienceLayout from './pages/ExperienceLayout'
import './App.css'

/** base: './' 时从 pathname 推断挂载前缀（Pages / Nginx 子目录） */
function resolveRouterBasename(): string | undefined {
  const configured = import.meta.env.BASE_URL || '/'
  if (configured !== './' && configured !== '.') {
    const cleaned = configured.replace(/\/$/, '')
    return cleaned === '' || cleaned === '/' ? undefined : cleaned
  }

  const parts = window.location.pathname.split('/').filter(Boolean)
  const routeLeafs = new Set(['parts'])
  while (parts.length && routeLeafs.has(parts[parts.length - 1]!)) {
    parts.pop()
  }
  if (parts.length && parts[parts.length - 1]!.includes('.')) {
    parts.pop()
  }
  return parts.length ? `/${parts.join('/')}` : undefined
}

export default function App() {
  return (
    <BrowserRouter basename={resolveRouterBasename()}>
      <Routes>
        {/* 父布局常挂载：/ 与 /parts 切换时不销毁 WebGL Canvas */}
        <Route element={<ExperienceLayout />}>
          <Route index element={null} />
          <Route path="parts" element={null} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
