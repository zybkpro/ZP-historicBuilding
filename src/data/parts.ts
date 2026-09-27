/** 万法归一殿模型构件模块 — 按材质/网格名匹配，面向古建科普 */

export type PartModule = {
  id: string
  name: string
  subtitle: string
  summary: string
  detail: string
  /** 与 mesh.name / material.name 做包含匹配 */
  match: string[]
  /** UI 色点 */
  color: string
  /**
   * 爆炸视图上下分层（自下而上 0–4）：
   * 0 台基 · 1 殿身 · 2 腰檐 · 3 斗拱屋架 · 4 屋面
   */
  layer: number
}

/** 五层结构（与爆炸视图一致） */
export const explodeLayers = [
  { layer: 0, name: '台基层', subtitle: '基座与踏跺' },
  { layer: 1, name: '殿身层', subtitle: '柱网 · 门墙 · 彩饰' },
  { layer: 2, name: '腰檐层', subtitle: '下层檐口与承托' },
  { layer: 3, name: '斗拱层', subtitle: '铺作 · 梁架 · 天花' },
  { layer: 4, name: '屋面层', subtitle: '屋顶与脊饰' },
] as const

export const partModules: PartModule[] = [
  {
    id: 'platform',
    name: '台基',
    subtitle: '承托整座殿宇的基座',
    summary:
      '台基是古建自下而上的第一层，以砖石或夯土抬高地面，既防潮排水，也象征礼制等级。',
    detail:
      '殿宇多建于台基之上，台基越高、层数越多，等级越高。台面以条砖铺砌，周边常设阶条石；木地栿或木板构成室内地面。参观时先看台基高度与踏跺数量，就能大致判断这座殿的礼制地位——地基，就是古建写给礼制的第一句话。',
    match: ['PlattformBricks_MAT', 'PlattformWood_MAT'],
    color: '#8b7355',
    layer: 0,
  },
  {
    id: 'columns',
    name: '柱网',
    subtitle: '立柱与柱身装饰',
    summary:
      '柱是木构架的竖向承重骨干，按面阔、进深排成柱网，也决定了每个开间的尺度。',
    detail:
      '中国古建以“柱网”组织平面：面阔几间、进深几间，皆由此定。檐柱挑檐，金柱承梁架；柱身可圆可方，常施油漆彩绘，柱头上再架枋、斗栱。这座殿里的一根根立柱与柱身饰件，正是整座殿宇“立起来”的骨架——先有柱子，才有屋顶。',
    match: ['TempleColumns_MAT', 'TempleColumnExtDecos_MAT', 'WoodBlue_MAT'],
    color: '#c45c26',
    layer: 1,
  },
  {
    id: 'door',
    name: '门框',
    subtitle: '入口与门屋构架',
    summary:
      '门是室内外的礼仪节点，门框、门槛与门扇的尺度，往往暗合开间与等级制度。',
    detail:
      '殿宇正门多居明间，门框由门楣、抱框、门槛组成。朱红大门、铺首门环、门钉数量，在礼制建筑里都有讲究。入口不只是交通口，更是轴线序列上“由外入内”的仪式节点——推开门的瞬间，仪式才算开始。',
    match: ['TempleDoorFrame_MAT'],
    color: '#9c2b1f',
    layer: 1,
  },
  {
    id: 'walls',
    name: '墙体',
    subtitle: '围护与分隔空间',
    summary:
      '墙在木构体系里主要负责围护——保温、防风、划分内外，而不是主要承重骨架。',
    detail:
      '抬梁、穿斗体系中，屋顶靠柱梁自承，墙体多属“填充”：外墙、山墙、隔墙用砖、土坯或木板。墙身可开窗、挂匾、施彩绘。明白“墙不承重”这一条，就抓住了中国木构与西方砌体建筑最根本的分野。',
    match: [
      'WallBlockExt1nr1_MAT',
      'WallBlockExt3nr1_MAT',
      'WallBlockExt3nr2_MAT',
      'TempleWallBlock11_MAT',
    ],
    color: '#7a6a58',
    layer: 1,
  },
  {
    id: 'painted-deco',
    name: '彩绘与红金饰',
    subtitle: '朱红、贴金的建筑彩饰',
    summary:
      '油漆与彩画不只是防腐，更用色彩和纹样诉说等级、寓意与时代风格。',
    detail:
      '官式建筑常见红墙黄瓦，梁枋施和玺彩画或旋子彩画；龙纹、卷草等高规格纹样常以贴金呈现。朱红与金色对比强烈，让结构层次在远处依旧清晰可读。读彩绘的部位与配色，就能读出这座殿的礼仪等级与装饰语言。',
    match: ['TempleRedGold_MAT'],
    color: '#b33a2b',
    layer: 1,
  },
  {
    id: 'interior-gods',
    name: '室内造像',
    subtitle: '殿内主尊与供奉空间',
    summary:
      '殿的核心，是室内空间与供奉对象——造像与佛坛，决定了朝拜的轴线与动线。',
    detail:
      '万法归一殿这类宗教殿堂，室内设主尊与胁侍；开间、尺度与采光，都围绕“瞻仰主尊”来组织。拆解时把造像单独分出，正是要提醒：建筑是容器，信仰才是中心。',
    match: ['TempleGods_MAT'],
    color: '#d4c4a8',
    layer: 1,
  },
  {
    id: 'mid-eaves',
    name: '腰檐',
    subtitle: '上下层之间的檐口',
    summary:
      '重檐殿宇在上下层之间设腰檐，既护住下层墙身，也把立面分出丰富的层次。',
    detail:
      '多檐建筑自下而上层层出檐。腰檐悬在主屋面之下，让立面形成“层叠如云”的节奏，同时为下层遮雨。拆解时把它单独分成一层，正好帮我们对照“台基 → 殿身 → 腰檐 → 斗栱 → 屋面”这条竖向构成。',
    match: ['TempleRoofLogs_MAT', 'TempleRoofStocks_MAT'],
    color: '#c4b59a',
    layer: 2,
  },
  {
    id: 'beams',
    name: '梁架',
    subtitle: '大木作横梁与枋木',
    summary:
      '梁与枋把柱网连成整体，把屋顶的重量层层卸到柱脚，是“大木作”的核心。',
    detail:
      '梁承受上部重量，枋横向拉结柱身、稳定平面，同属大木作。北方殿堂多用抬梁式：梁上立短柱，再承上一层梁，逐层收进直至脊檩。看懂这一层层梁架，就基本看懂了古建怎么“把屋顶稳稳托起来”。',
    match: ['TempleBigLogBottom_MAT', 'TempleBigLogTop_MAT'],
    color: '#a67c52',
    layer: 3,
  },
  {
    id: 'dougong',
    name: '斗栱与屋架',
    subtitle: '檐下铺作与屋顶木构',
    summary:
      '斗栱（铺作）是柱头与屋檐之间的过渡构件，既挑出屋檐承重，也是时代与等级的活化石。',
    detail:
      '斗是方形垫块，栱是弓形短木，一层层叠出即为铺作。唐宋斗栱雄大疏朗，明清趋于繁密精巧。再往上，椽、望板、檩条等屋架层层铺开，与斗栱共同完成“柱 → 斗栱 → 屋面”的传力链。看斗栱的尺度与疏密，就能估出这座殿的年代气质。',
    match: ['TempleRoofHolds_MAT'],
    color: '#d4a017',
    layer: 3,
  },
  {
    id: 'interior-ceiling',
    name: '天花藻井',
    subtitle: '室内顶棚与祥瑞纹饰',
    summary:
      '天花与藻井装点殿内上空，遮住梁架之余，更以龙纹、星象营造一方神圣天地。',
    detail:
      '藻井是向上凹进的天花，专用于殿内最尊贵的位置上方；龙纹、星宿纹等强化宗教或皇权象征。这座殿里的龙纹顶饰与星象构件提醒我们：古建从不只“看外面”——室内装饰与室外屋面一样讲究，里外是一体的完整艺术品。',
    match: [
      'TempleIntRoofDragon_MAT',
      'TempleInteriorRoofDecoTop_MAT',
      'TempleStars_MAT',
    ],
    color: '#4a6fa5',
    layer: 3,
  },
  {
    id: 'roof',
    name: '屋面',
    subtitle: '屋面覆盖与曲线轮廓',
    summary:
      '屋面不止遮风挡雨——那一条飞檐曲线，正是中国建筑最有辨识度的天际线。',
    detail:
      '官式殿宇以筒瓦、板瓦覆顶，屋脊分正脊、垂脊、戗脊。檐角微微上翘，让檐口化作柔和曲线：既加速排水，也成就《诗经》里“如鸟斯革，如翚斯飞”的轻盈意象。再看屋顶形式——庑殿、歇山、悬山、硬山，等级依次递减，是分辨古建类型的第一把钥匙。',
    match: ['TempleRoof_MAT'],
    color: '#6b3a2a',
    layer: 4,
  },
  {
    id: 'gold-ornament',
    name: '金饰屋脊',
    subtitle: '鎏金与屋脊装饰',
    summary:
      '屋脊、宝顶与檐口的金色饰件，既是宗教象征，也是整座殿宇的视觉焦点。',
    detail:
      '藏传佛教与皇家殿宇常见鎏金铜瓦、宝瓶、法轮等饰件。金色在阳光下格外耀眼，远望即成一殿之眼。这座殿取名“金殿”，正因屋面与脊饰大量鎏金——用最夺目的材料，宣示神圣与尊贵。',
    match: [
      'TempleGold',
      'TempleGoldRoof_MAT',
      'TempleGoldRoof2_MAT',
      'TempleGoldRoofDecos',
      'TempleGoldRoofDecosBack',
      'GoldOrnaments_colour',
    ],
    color: '#c4a35a',
    layer: 4,
  },
  {
    id: 'details',
    name: '细部构件',
    subtitle: '门窗隔扇与附属装修',
    summary:
      '大木骨架之外，还有大量装修细部——隔扇、挂落、角饰，丰富着近人尺度的观感。',
    detail:
      '小木作包括门窗、隔断、天花线脚等，不承屋架荷载，却决定你走近它时的感受与使用方式。拆解视图中未归入明确大类的网格都收进本组，便于对照“大木承结构、小木定体验”的层次关系。',
    match: [],
    color: '#9a8b7a',
    layer: 1,
  },
]

export function findModuleByName(objectName: string, materialName = ''): PartModule {
  const haystack = `${objectName} ${materialName}`
  for (const mod of partModules) {
    if (mod.id === 'details') continue
    if (mod.match.some((key) => haystack.includes(key))) return mod
  }
  return partModules.find((m) => m.id === 'details')!
}

export function getModuleById(id: string | null): PartModule | undefined {
  if (!id) return undefined
  return partModules.find((m) => m.id === id)
}

export function modulesInLayer(layer: number): PartModule[] {
  return partModules.filter((m) => m.layer === layer)
}
