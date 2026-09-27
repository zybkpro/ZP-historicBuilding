import { NavLink } from 'react-router-dom'
import { siteMeta } from '../data/buildings'

/** 两页顶部共用导航：整体 / 分项互不共享状态，仅跳转 */
export function PageNav() {
  return (
    <header className="overlay-header">
      <div className="header-top">
        <div>
          <p className="brand">{siteMeta.title}</p>
          <p className="brand-sub">{siteMeta.subtitle}</p>
        </div>
        <nav className="view-mode" aria-label="页面切换">
          <span className="view-mode-frame" aria-hidden>
            <i className="is-tl" />
            <i className="is-tr" />
            <i className="is-bl" />
            <i className="is-br" />
          </span>
          <div className="view-mode-track">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `view-mode-btn${isActive ? ' is-active' : ''}`
              }
            >
              整体展示
            </NavLink>
            <NavLink
              to="/parts"
              className={({ isActive }) =>
                `view-mode-btn${isActive ? ' is-active' : ''}`
              }
            >
              分项展示
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
