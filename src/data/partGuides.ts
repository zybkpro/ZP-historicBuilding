/** 中国古建筑类别科普：不限于当前模型，供右侧详解面板使用 */

export type PartGuideImage = {
  src: string
  caption: string
}

export type PartGuide = {
  /** 对应 partModules.id */
  id: string
  /** 类别标题 */
  title: string
  /** 副题 */
  subtitle: string
  /** 导语 */
  lead: string
  /** 分段正文 */
  sections: { heading: string; body: string }[]
  /** 1–2 张插图 */
  images: PartGuideImage[]
}

export const partGuides: PartGuide[] = [
  {
    id: 'platform',
    title: '台基：古建的「地基与礼制」',
    subtitle: '中国古建筑通识 · 台基层',
    lead:
      '台基是中国古典建筑自下而上的第一层。它不只垫高地面，更用高度与层数写出建筑的等级——礼制，从脚下开始。',
    sections: [
      {
        heading: '形制与功能',
        body:
          '台基以夯土、砖石砌筑，抬高室内地坪，隔绝潮气、利排水，也形成踏跺、御路等礼仪路径。常见有单层台基、多层须弥座；宫殿、坛庙的台基往往更高、更讲究雕饰。',
      },
      {
        heading: '如何辨认等级',
        body:
          '看层数、看高度、看有无汉白玉栏杆与雕龙御路。等级越高，台基越「隆重」。民居多为简单条石台帮；官式建筑则常见须弥座束腰、圭角等做法。',
      },
    ],
    images: [
      {
        src: '/images/guides/platform-1.webp',
        caption: '须弥座台基示意：层层束腰与阶条石',
      },
      {
        src: '/images/guides/platform-2.webp',
        caption: '殿前踏跺与御路：礼仪轴线的起点',
      },
    ],
  },
  {
    id: 'columns',
    title: '柱网：把空间「立」起来',
    subtitle: '中国古建筑通识 · 大木作',
    lead:
      '中国木构以柱承重。面阔、进深相交成网，开间尺度由此而定——先立柱，再架梁，屋顶才有所归依。',
    sections: [
      {
        heading: '檐柱与金柱',
        body:
          '檐柱在外圈挑檐，金柱在内圈承梁架。柱可圆可方，柱身常髹漆彩绘；柱头之上承额枋、平板枋，再接斗栱或直接承梁。柱径、柱高比也是时代与等级的线索。',
      },
      {
        heading: '柱网即平面',
        body:
          '「面阔几间、进深几间」描述的就是柱网。明间最宽居中，次间、梢间向两侧收分，形成对称庄重的殿堂节奏。理解柱网，就抓住了古建平面的语法。',
      },
    ],
    images: [
      {
        src: '/images/guides/columns-1.webp',
        caption: '朱红柱列与额枋：殿堂的竖向骨架',
      },
      {
        src: '/images/guides/columns-2.webp',
        caption: '柱网平面示意：面阔与进深的交点',
      },
    ],
  },
  {
    id: 'door',
    title: '门框：礼仪的「内外之界」',
    subtitle: '中国古建筑通识 · 小木作与门制',
    lead:
      '门不只是出入通道，更是轴线序列上的仪式节点。门框、门槛、门钉与色彩，往往写着等级与规矩。',
    sections: [
      {
        heading: '门的构成',
        body:
          '门楣、抱框、门槛组成门框；门扇可为板门、隔扇。宫殿寺观正门多居明间，朱红大门、铺首衔环、门钉行列都是可读的制度符号。',
      },
      {
        heading: '由外入内',
        body:
          '沿中轴线南来，门是「进入」的第一次确认。门的高度、宽度与开间相配，使人在迈入时完成尺度与心理的转换——从世俗场地，进入殿堂秩序。',
      },
    ],
    images: [
      {
        src: '/images/guides/door-1.webp',
        caption: '朱红大门与铺首：礼仪入口的典型形象',
      },
      {
        src: '/images/guides/door-2.webp',
        caption: '门框、门槛与隔扇细节',
      },
    ],
  },
  {
    id: 'walls',
    title: '墙体：围护多于承重',
    subtitle: '中国古建筑通识 · 围护结构',
    lead:
      '在抬梁、穿斗体系里，屋架主要靠柱梁自立，墙体多为填充与围护——这是中国木构与西方砌体建筑的重要分野。',
    sections: [
      {
        heading: '墙做什么',
        body:
          '外墙挡风御寒，山墙封护两端，隔墙划分室内。材料可为砖、土坯、木板墙；墙面可开窗、设匾、施彩绘或影壁。',
      },
      {
        heading: '「墙倒屋不塌」',
        body:
          '这句话概括了木构优势：竖向荷载走柱梁，墙即便损坏，主体仍可能暂时自立。参观时注意墙与柱的交接，能更好理解传力路径。',
      },
    ],
    images: [
      {
        src: '/images/guides/walls-1.webp',
        caption: '红墙与木柱并存：围护与承重各司其职',
      },
      {
        src: '/images/guides/walls-2.webp',
        caption: '山墙与屋面交接的立面层次',
      },
    ],
  },
  {
    id: 'painted-deco',
    title: '彩绘与贴金：色彩里的等级',
    subtitle: '中国古建筑通识 · 油饰彩画',
    lead:
      '油漆保护木材，彩画讲述等级与寓意。朱红、青绿、贴金龙纹，使结构在远处仍清晰可读，也使建筑成为「可阅读的礼制文本」。',
    sections: [
      {
        heading: '和玺、旋子与苏式',
        body:
          '官式彩画常见和玺（等级最高，多龙纹）、旋子（官府常用）、苏式（园林宅第更灵活）。梁枋、斗栱、天花都是主要施彩部位。',
      },
      {
        heading: '看彩绘读制度',
        body:
          '金色越多、龙纹越完整，往往等级越高。民居彩画题材更生活化。对照梁枋分色与图案母题，是辨识建筑身份的快捷方法。',
      },
    ],
    images: [
      {
        src: '/images/guides/painted-deco-1.webp',
        caption: '梁枋彩画：青绿底与贴金纹样',
      },
      {
        src: '/images/guides/painted-deco-2.webp',
        caption: '朱红柱身与金饰对比：远观仍分明',
      },
    ],
  },
  {
    id: 'interior-gods',
    title: '室内造像：殿的「精神中心」',
    subtitle: '中国古建筑通识 · 殿堂与信仰空间',
    lead:
      '对佛殿、道观与祠庙而言，建筑是容器，主尊与供奉才是空间组织的核心。轴线、采光与开间，常围绕「瞻仰」展开。',
    sections: [
      {
        heading: '坛位与动线',
        body:
          '主尊多居中靠后，胁侍分列两侧；信徒沿中轴进入，跪拜与绕行形成仪式动线。佛坛高度、香案距离都影响空间感受。',
      },
      {
        heading: '建筑服务于瞻仰',
        body:
          '藻井、天花、侧光与门的对景，往往强化主尊的视觉焦点。读懂造像位置，也就读懂了这座殿为什么如此开间、如此进深。',
      },
    ],
    images: [
      {
        src: '/images/guides/interior-gods-1.webp',
        caption: '殿内主尊与供桌：信仰空间的焦点',
      },
      {
        src: '/images/guides/interior-gods-2.webp',
        caption: '中轴线朝拜示意：由门至坛',
      },
    ],
  },
  {
    id: 'mid-eaves',
    title: '腰檐：重檐的「中间节奏」',
    subtitle: '中国古建筑通识 · 屋檐层次',
    lead:
      '重檐殿宇在上下层之间设腰檐（披檐），保护下层墙身，也让立面出现层叠如云的节奏——古建天际线因此更丰富。',
    sections: [
      {
        heading: '为何要腰檐',
        body:
          '多层屋檐可遮雨、减墙面受潮，并划分立面比例。副阶周匝、腰檐与上檐共同构成「台基—殿身—檐口—屋面」的竖向阅读顺序。',
      },
      {
        heading: '拆解时为何单独一层',
        body:
          '腰檐常被忽略，但它是重檐形象的关键过渡。单独分出，便于对照斗栱出跳、椽望与上檐的关系，看清「层叠」如何完成。',
      },
    ],
    images: [
      {
        src: '/images/guides/mid-eaves-1.webp',
        caption: '重檐殿宇：上檐与腰檐的层叠',
      },
      {
        src: '/images/guides/mid-eaves-2.webp',
        caption: '腰檐剖面示意：保护墙身与丰富立面',
      },
    ],
  },
  {
    id: 'beams',
    title: '梁架：大木作如何托起屋顶',
    subtitle: '中国古建筑通识 · 抬梁与梁枋',
    lead:
      '梁、枋把柱网连成整体，把屋面荷载层层传至柱脚。看懂梁架，就大致看懂中国古建如何「把屋顶托起来」。',
    sections: [
      {
        heading: '抬梁式简述',
        body:
          '北方殿堂多见抬梁：梁上立短柱，再承上一层梁，逐层收进直至脊檁。枋连接柱身、稳定平面。梁的断面、卷杀与彩绘都是时代特征。',
      },
      {
        heading: '与穿斗的对比',
        body:
          '南方民居常见穿斗：柱更密、以穿枋连结，用料相对灵活。殿堂为求开阔空间多用抬梁。对照二者，能理解地域与功能如何选择结构。',
      },
    ],
    images: [
      {
        src: '/images/guides/beams-1.webp',
        caption: '抬梁式梁架：层层叠梁至脊檁',
      },
      {
        src: '/images/guides/beams-2.webp',
        caption: '梁枋交接与彩绘：受力与装饰一体',
      },
    ],
  },
  {
    id: 'dougong',
    title: '斗栱：柱头与屋檐之间的智慧',
    subtitle: '中国古建筑通识 · 铺作',
    lead:
      '斗栱（铺作）是柱头与屋檐之间的过渡：出檐、传力、减震，也是身份与时代的标志。唐宋雄大疏朗，明清趋于繁密装饰化。',
    sections: [
      {
        heading: '斗与栱',
        body:
          '斗是方形垫块，栱是弓形短木，纵横交织层层出跳。其上接檩椽望板，完成「柱 → 斗栱 → 屋面」的路径。',
      },
      {
        heading: '为何重要',
        body:
          '斗栱放大檐口、保护墙身与台基，并使立面产生丰富阴影。它既是结构构件，也是审美符号——读斗栱，几乎等于读半部中国建筑史。',
      },
    ],
    images: [
      {
        src: '/images/guides/dougong-1.webp',
        caption: '檐下斗栱特写：层层出跳的铺作',
      },
      {
        src: '/images/guides/dougong-2.webp',
        caption: '斗栱传力示意：从柱头到檐口',
      },
    ],
  },
  {
    id: 'interior-ceiling',
    title: '天花藻井：头顶上的礼制与象征',
    subtitle: '中国古建筑通识 · 室内顶棚',
    lead:
      '天花遮掩梁架，藻井向上凹进，以龙纹、星象等图案营造神圣空间。最尊贵的位置，往往有最华丽的顶。',
    sections: [
      {
        heading: '天花与藻井',
        body:
          '天花可分为井口天花、海墁天花等；藻井多用于主殿正中上方，层层收进如井。图案题材与建筑等级紧密相关。',
      },
      {
        heading: '里外一体',
        body:
          '室外屋面塑造天际线，室内顶棚塑造仪式感。二者同属完整设计：参观时仰观藻井，可与室外脊饰对照阅读。',
      },
    ],
    images: [
      {
        src: '/images/guides/interior-ceiling-1.webp',
        caption: '龙井藻井：殿内最尊处的顶饰',
      },
      {
        src: '/images/guides/interior-ceiling-2.webp',
        caption: '井口天花：规整格子与彩绘',
      },
    ],
  },
  {
    id: 'roof',
    title: '屋面：东方建筑的天际线',
    subtitle: '中国古建筑通识 · 屋顶形制',
    lead:
      '屋面遮风雨，更以曲线与脊饰塑造识别度。庑殿、歇山、悬山、硬山等形式，往往对应不同的等级秩序。',
    sections: [
      {
        heading: '曲线与排水',
        body:
          '翼角起翘、檐口生起，既利排水，也形成「如鸟斯革，如翚斯飞」的意象。筒瓦、板瓦覆盖屋面，正脊、垂脊、戗脊组织轮廓。',
      },
      {
        heading: '形式即等级',
        body:
          '重檐庑殿等级最高，歇山常见于殿堂亭阁，硬山、悬山多用于一般建筑。远观先认屋顶，是辨识古建类型的第一课。',
      },
    ],
    images: [
      {
        src: '/images/guides/roof-1.webp',
        caption: '歇山/庑殿屋顶曲线与脊饰',
      },
      {
        src: '/images/guides/roof-2.webp',
        caption: '翼角起翘：檐口的东方韵律',
      },
    ],
  },
  {
    id: 'gold-ornament',
    title: '金饰屋脊：神圣与尊贵的高光',
    subtitle: '中国古建筑通识 · 脊饰与金银作',
    lead:
      '金色集中于屋脊、宝顶与檐口饰件，既是宗教象征，也是远观的视觉焦点。藏传与皇家相关殿宇尤爱鎏金铜瓦与法器宝顶。',
    sections: [
      {
        heading: '脊饰语言',
        body:
          '正脊可设宝瓶、法轮、吻兽；垂脊、戗脊亦有走兽序列。数量与题材往往受规制约束，不可随意增减。',
      },
      {
        heading: '为何用金',
        body:
          '金色耐候反光，在群楼或山峦背景中格外醒目，强调殿宇的中心地位。它把「礼」与「信仰」写到了天际线上。',
      },
    ],
    images: [
      {
        src: '/images/guides/gold-ornament-1.webp',
        caption: '鎏金屋面与宝顶：远观的焦点',
      },
      {
        src: '/images/guides/gold-ornament-2.webp',
        caption: '脊饰法器与吻兽细节',
      },
    ],
  },
  {
    id: 'details',
    title: '细部构件：近人尺度的完成度',
    subtitle: '中国古建筑通识 · 小木作',
    lead:
      '大木决定骨架，小木决定体验。隔扇、挂落、窗棂、栏杆与角部装饰，让建筑在「走近以后」仍然耐看。',
    sections: [
      {
        heading: '小木作范畴',
        body:
          '门窗隔扇、罩、碧纱橱、天花局部线脚等，通常不承担主要屋架荷载，却决定采光、通风与近人尺度的观感。',
      },
      {
        heading: '为何单独分类',
        body:
          '拆解模型时，未归入明确大木类别的装修构件可归入细部，便于对照「承重体系」与「装修体系」的层次关系。',
      },
    ],
    images: [
      {
        src: '/images/guides/details-1.webp',
        caption: '隔扇与棱花：近人尺度的装修',
      },
      {
        src: '/images/guides/details-2.webp',
        caption: '挂落、栏杆与角部装饰',
      },
    ],
  },
]

export function getPartGuide(id: string | null): PartGuide | undefined {
  if (!id) return undefined
  return partGuides.find((g) => g.id === id)
}
