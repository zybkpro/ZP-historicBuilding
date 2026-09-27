import { publicUrl } from '../lib/publicUrl'

export type BuildingInfo = {
  id: string
  name: string
  era: string
  summary: string
  /** 更完整的殿宇介绍（右上角面板） */
  detail: string
  /** 简介与详解之间的配图（public 路径） */
  coverImage?: string
  modelPath: string
}

/** 站点内容：万法归一殿（Sketchfab CC0 模型，原型取自清承德普陀宗乘之庙主殿意象） */
export const buildings: BuildingInfo[] = [
  {
    id: 'wan-fa-gui-yi',
    name: '万法归一殿',
    era: '殿堂木构 · 藏传金顶殿宇',
    summary:
      '万法归一殿是清承德普陀宗乘之庙的主殿意象：汉藏交融的木构殿堂，重檐攒尖、金瓦耀日，曾是清帝与各族首领礼佛集会之处。',
    coverImage: publicUrl('images/wanfa-guiyi-hall-4x3.webp'),
    detail:
      '原型位于河北承德避暑山庄北侧的普陀宗乘之庙（俗称“小布达拉宫”），建于乾隆三十五年（1770 年）。殿平面近方形，重檐四角攒尖顶，上覆鎏金鱼鳞铜瓦与法铃宝顶，金光在群楼环抱中尤为夺目。大木架以柱网承托梁枋、斗栱与屋面，下有台基，中设殿身与腰檐层次，体现官式营造与藏传佛殿装饰的结合。乾隆三十六年，乾隆帝曾在此接见东归的土尔扈特部首领渥巴锡，并举行讲经祝寿，殿因此也承载着清代民族交往与国家礼仪的记忆。本页三维模型便于对照：拖动滑杆可按台基、殿身、腰檐、斗拱、屋面五层爆炸拆解；点击左侧模块，阅读对应营造知识。',
    modelPath: publicUrl('models/chinese-architecture.glb'),
  },
]

export const siteMeta = {
  title: '中国古建筑',
  subtitle: '三维拆解科普',
  hint: '拖拽旋转 · 滚轮缩放 · 滑杆爆炸',
}
