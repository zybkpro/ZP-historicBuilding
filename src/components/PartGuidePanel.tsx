import { getPartGuide } from '../data/partGuides'
import { getModuleById } from '../data/parts'
import { publicUrl } from '../lib/publicUrl'

type PartGuidePanelProps = {
  selectedId: string
  onClose: () => void
}

/** 选中构件后右侧展示：中国古建筑类别详解 + 插图 */
export function PartGuidePanel({ selectedId, onClose }: PartGuidePanelProps) {
  const mod = getModuleById(selectedId)
  const guide = getPartGuide(selectedId)
  if (!mod || !guide) return null

  return (
    <aside className="part-guide" aria-label={`${mod.name}类别介绍`}>
      <header className="part-guide-head">
        <div>
          <p className="part-guide-kicker">{guide.subtitle}</p>
          <h2 className="part-guide-title">{guide.title}</h2>
        </div>
        <button
          type="button"
          className="part-guide-close"
          onClick={onClose}
          aria-label="关闭介绍"
        >
          关闭
        </button>
      </header>

      <p className="part-guide-lead">{guide.lead}</p>

      <div className="part-guide-figures">
        {guide.images.map((img) => (
          <figure key={img.src} className="part-guide-figure">
            <img
              src={publicUrl(img.src)}
              alt={img.caption}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{img.caption}</figcaption>
          </figure>
        ))}
      </div>

      {guide.sections.map((sec) => (
        <section key={sec.heading} className="part-guide-section">
          <h3>{sec.heading}</h3>
          <p>{sec.body}</p>
        </section>
      ))}

      <p className="part-guide-note">
        以上为「{mod.name}」在中国古建筑中的通识介绍；左侧三维模型对应本殿构件，可对照观察。
      </p>
    </aside>
  )
}
