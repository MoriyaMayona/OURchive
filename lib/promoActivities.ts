import { avatarImages } from "@/lib/mockData";
import { reimuBirthdayImages } from "@/lib/reimuBirthdayAssets";
import type { PromoImage, PromoPlatform, PromoStyle, PromoWork } from "@/lib/promoData";

export type PromoMember = {
  name: string;
  role: string;
  avatar: string;
  avatarSrc?: string;
};

export type PromoActivityData = {
  id: string;
  name: string;
  time: string;
  format: string;
  source: string;
  summary: string;
  tags: string[];
  layoutAdvice: string;
  members: PromoMember[];
  works: PromoWork[];
  images: PromoImage[];
};

const imageGradients = [
  "from-rose-200 via-red-100 to-sky-200",
  "from-sky-100 via-white to-rose-100",
  "from-cyan-100 via-sky-200 to-fuchsia-100",
  "from-amber-100 via-rose-100 to-emerald-100",
  "from-red-100 via-white to-slate-200",
  "from-emerald-100 via-sky-100 to-amber-100",
];

const commonMembers: PromoMember[] = [
  { name: "南枝", role: "策划", avatar: "南", avatarSrc: avatarImages.nanzhi },
  { name: "墨团", role: "画手", avatar: "墨", avatarSrc: avatarImages.motuan },
  { name: "未央", role: "写手", avatar: "央", avatarSrc: avatarImages.weiyang },
  { name: "阿璃", role: "画手", avatar: "璃", avatarSrc: avatarImages.ali },
  { name: "小满", role: "画手", avatar: "满" },
  { name: "青禾", role: "画手", avatar: "青" },
  { name: "夜雀", role: "写手", avatar: "夜" },
  { name: "河童", role: "整理", avatar: "河" },
  { name: "小周", role: "归档", avatar: "周", avatarSrc: avatarImages.xiaozhou },
];

function work(title: string, author: string, type: string, image?: string): PromoWork {
  return { title, author, type, image };
}

function image(id: string, title: string, type: string, motif: string, index: number, src?: string): PromoImage {
  return {
    id,
    title,
    type,
    motif,
    image: src,
    gradient: imageGradients[index % imageGradients.length],
  };
}

export const promoActivities: PromoActivityData[] = [
  {
    id: "reimu-birthday",
    name: "灵梦生日图文接力活动",
    time: "2026.04.29 - 2026.05.07",
    format: "图文接力 / 生日企划",
    source: "群聊讨论 + 活动讨论区 + 作品草稿",
    summary: "围绕灵梦生日展开的24小时图文接力，成员用插画、短篇、表情包、小插图与网页预览共同完成生日纪念合辑。",
    tags: ["#灵梦生日", "#图文接力", "#东方同好", "#社群创作"],
    layoutAdvice: "建议先放合辑封面或开场插画，再按接力顺序展示短篇、表情包、小插图和过程稿，最后补成员感谢与署名说明。",
    members: commonMembers,
    works: [
      work("《神社清晨的灵梦》", "墨团", "开场插画", reimuBirthdayImages.shrineMorningFinal),
      work("《神社来信》", "未央", "短篇文字", reimuBirthdayImages.shrineLetter),
      work("《灵梦生日表情包》", "小满", "表情包", reimuBirthdayImages.stickerSheet),
      work("《赛钱箱旁边的生日蛋糕》", "青禾", "小插图", reimuBirthdayImages.birthdayCake),
      work("《合辑封面分镜》", "阿璃", "封面候选", reimuBirthdayImages.anthologyStoryboard),
      work("《灵梦生日图文接力合辑》", "阿璃 / 群体共创", "合辑封面", reimuBirthdayImages.anthologyCover),
    ],
    images: [
      image("morning", "《神社清晨的灵梦》", "开场插画", "首图 / 主视觉", 0, reimuBirthdayImages.shrineMorningFinal),
      image("letter", "《神社来信》", "短篇文字", "情绪补充 / 信件页", 1, reimuBirthdayImages.shrineLetter),
      image("sticker", "《灵梦生日表情包》", "表情包", "轻松氛围 / 社群感", 2, reimuBirthdayImages.stickerSheet),
      image("cake", "《赛钱箱旁边的生日蛋糕》", "小插图", "生日主题补充图", 3, reimuBirthdayImages.birthdayCake),
      image("cover-storyboard", "《合辑封面分镜》", "封面候选", "过程稿 / 封面整理", 4, reimuBirthdayImages.anthologyStoryboard),
      image("anthology-cover", "《灵梦生日图文接力合辑》", "合辑封面", "宣发封面 / 合辑主视觉", 5, reimuBirthdayImages.anthologyCover),
    ],
  },
  {
    id: "campus-postcard",
    name: "角色 in 校园——实景明信片拍摄与绘制活动",
    time: "2026.03.22 - 2026.03.30",
    format: "摄影 / 插画再创作 / 校园实景",
    source: "活动档案 + 场景照片 + 明信片作品整理",
    summary: "成员在校园中拍摄适合角色出没的真实场景，并基于照片进行角色绘制，最终形成一组“角色来到校园”的明信片风格作品。",
    tags: ["#角色in校园", "#实景明信片", "#校园创作", "#同好摄影"],
    layoutAdvice: "建议用校园场景图做首图，后续按地点线索串联作品，突出真实校园空间和角色再创作之间的对照。",
    members: commonMembers,
    works: [
      work("《灵梦在东区草坪》", "青禾", "实景插画明信片", "/demo-assets/archive-works/campus-postcard-reimu-lawn.png"),
      work("《魔理沙经过图书馆》", "墨团", "摄影合成插画", "/demo-assets/archive-works/campus-postcard-marisa-library.png"),
      work("《早苗的午后天桥》", "阿璃", "校园摄影再绘制", "/demo-assets/archive-works/campus-postcard-sanae-skybridge.png"),
      work("《食堂门口的妖梦》", "小满", "Q版明信片"),
      work("《校园地图角色贴纸组》", "河童", "贴纸/地图设计"),
    ],
    images: [
      image("grass", "《灵梦在东区草坪》", "实景插画明信片", "校园草坪 / 第一张明信片", 0, "/demo-assets/archive-works/campus-postcard-reimu-lawn.png"),
      image("library", "《魔理沙经过图书馆》", "摄影合成插画", "图书馆台阶 / 透视感", 1, "/demo-assets/archive-works/campus-postcard-marisa-library.png"),
      image("bridge", "《早苗的午后天桥》", "校园摄影再绘制", "天桥光影 / 清爽构图", 2, "/demo-assets/archive-works/campus-postcard-sanae-skybridge.png"),
    ],
  },
  {
    id: "story-relay",
    name: "故事接龙——给定开头的图文续写活动",
    time: "2026.02.18 - 2026.02.25",
    format: "文字接龙 / 插图 / 漫画",
    source: "故事接龙记录 + 插图分镜 + 设定整理",
    summary: "管理组给出一个神社异变开头，成员轮流续写故事，并自由配以插图、漫画分镜和角色设定补充，最后整理成一份群体创作故事集。",
    tags: ["#故事接龙", "#图文续写", "#同人创作", "#神社异变"],
    layoutAdvice: "建议按故事章节顺序排布，先给出开头钩子，再展示章节、插图、分镜和关系图，让读者能顺着剧情进入。",
    members: commonMembers,
    works: [
      work("《神社异变·开端》", "南枝", "开头插图 / 设定图", "/demo-assets/archive-works/story-relay-shrine-incident-opening.png"),
      work("《追迹者的来信》", "夜雀", "短篇文字 / 图文稿", "/demo-assets/archive-works/story-relay-tracker-letter.png"),
      work("《夜路四格》", "阿璃", "漫画 / 四格", "/demo-assets/archive-works/story-relay-night-road-comic.png"),
    ],
    images: [
      image("chapter-one", "《神社异变·开端》", "开头插图 / 设定图", "开头图 / 悬疑氛围", 0, "/demo-assets/archive-works/story-relay-shrine-incident-opening.png"),
      image("letter", "《追迹者的来信》", "短篇文字 / 图文稿", "线索补充 / 信件页", 1, "/demo-assets/archive-works/story-relay-tracker-letter.png"),
      image("paper-crane", "《夜路四格》", "漫画 / 四格", "轻松四格 / 夜路回神社", 2, "/demo-assets/archive-works/story-relay-night-road-comic.png"),
    ],
  },
  {
    id: "water-lantern-fair",
    name: "水灯节场贩与招新活动",
    time: "2026.03.10 - 2026.03.15",
    format: "线下摊位 / 作品展示 / 招新",
    source: "摊位复盘 + 物料清单 + 现场记录",
    summary: "社群围绕校园水灯节设置同好摊位，展示成员作品、交换无料、进行招新，并记录摊位布置、物料准备和现场互动经验。",
    tags: ["#水灯节", "#场贩", "#招新", "#社群活动"],
    layoutAdvice: "建议按摊位主视觉、无料展示、现场动线、招新说明和夜拍记录组织，突出线下活动的真实参与感。",
    members: commonMembers,
    works: [
      work("《水灯节场贩招新海报》", "河童", "活动海报 / 招新物料", "/demo-assets/archive-works/water-lantern-recruitment-poster.png"),
      work("《无料交换桌》", "小满", "摊位记录 / 周边展示", "/demo-assets/archive-works/water-lantern-free-exchange-table.png"),
      work("《夜色摊位记录》", "青禾", "活动回顾图 / 现场记录", "/demo-assets/archive-works/water-lantern-booth-recap.png"),
    ],
    images: [
      image("recruitment", "《水灯节场贩招新海报》", "活动海报 / 招新物料", "招新海报 / 主视觉", 0, "/demo-assets/archive-works/water-lantern-recruitment-poster.png"),
      image("free-exchange", "《无料交换桌》", "摊位记录 / 周边展示", "无料交换 / 展示桌", 1, "/demo-assets/archive-works/water-lantern-free-exchange-table.png"),
      image("booth-recap", "《夜色摊位记录》", "活动回顾图 / 现场记录", "摊位夜色 / 现场记录", 2, "/demo-assets/archive-works/water-lantern-booth-recap.png"),
    ],
  },
];

export function getPromoActivity(activityId?: string | null): PromoActivityData {
  return promoActivities.find((activity) => activity.id === activityId) ?? promoActivities[0];
}

export function getPromoActivityDataForRequest(activity: PromoActivityData) {
  return {
    activity: {
      id: activity.id,
      name: activity.name,
      time: activity.time,
      format: activity.format,
      source: activity.source,
      summary: activity.summary,
    },
    members: activity.members,
    works: activity.works,
    images: activity.images.map(({ id, title, type, motif }) => ({ id, title, type, motif })),
  };
}

export function getPromoImageForActivityTitle(activity: PromoActivityData, title: string) {
  return activity.works.find((work) => work.title === title)?.image ?? activity.images.find((item) => item.title === title)?.image;
}

export function getDefaultMatchedAssetsForActivity(activity: PromoActivityData) {
  return activity.images.slice(0, 4).map((item) => {
    const sourceWork = activity.works.find((workItem) => workItem.title === item.title);
    return {
      id: item.id,
      title: item.title,
      type: sourceWork?.type ?? item.type,
      author: sourceWork?.author,
      description: item.motif,
      image: item.image,
    };
  });
}

export function getPromoCopyForActivity(activity: PromoActivityData, platform: PromoPlatform, style: PromoStyle) {
  const workLine = activity.works.map((item) => `${item.author}：${item.title}｜${item.type}`).join("、");
  const stylePrefix: Record<PromoStyle, string> = {
    同好群口吻: "这次活动从一句轻轻的提议开始，最后被大家一点点补成了可以好好收藏的社群记录。",
    文艺: "一些灵感沿着同一条线索慢慢展开，最后留下了属于这次活动的共同切片。",
    活泼: "从想法冒头到素材刷齐，大家的行动力这次真的拉满了。",
    官方: "本次活动完成了策划、素材征集、作品整理与宣发归档等环节，形成了可复用的社群活动记录。",
  };

  const baseBody = `${stylePrefix[style]}\n\n${activity.summary}\n\n本次推荐展示的素材包括：${workLine}。\n\n这些作品和记录可以继续用于活动回顾、成员展示与后续宣发。`;

  const copyByPlatform: Record<PromoPlatform, { title: string; body: string; layout: string }> = {
    QQ空间: {
      title: `${activity.name}整理好啦｜这次大家一起留下了新的活动记录`,
      body: baseBody,
      layout: `${activity.layoutAdvice} QQ空间适合用自然分段，最后补一句感谢参与和围观的成员。`,
    },
    小红书: {
      title: `这个同好群活动也太会整理了｜${activity.name}`,
      body: `${activity.summary}\n\n这次最适合先看：${activity.works.slice(0, 3).map((item) => item.title).join("、")}。\n\n从素材到归档都被认真留下来了，适合做成一组可滑动的活动回顾图。`,
      layout: `${activity.layoutAdvice} 小红书建议首图突出活动主题，后续用短句拆分作品亮点和成员贡献。`,
    },
    Lofter: {
      title: `${activity.name}｜一次被认真留下的共创记录`,
      body: `${stylePrefix.文艺}\n\n${activity.summary}\n\n${activity.works.map((item) => `${item.title}（${item.author}）`).join("、")}彼此接住，让这次活动不只是一组作品，也是一段共同完成的创作过程。`,
      layout: `${activity.layoutAdvice} Lofter适合保留作品标题、作者署名和简短前言，让读者按作品情绪顺序阅读。`,
    },
    公众号: {
      title: `活动回顾｜${activity.name}`,
      body: `活动概况：${activity.summary}\n\n创作与整理：本次活动围绕「${activity.format}」展开，素材来源包括${activity.source}。\n\n作品成果：${workLine}。\n\n经验沉淀：后续可继续完善署名、授权、物料复盘和可复用模板，让活动记录更易归档与传播。`,
      layout: `${activity.layoutAdvice} 公众号建议按“活动概况-创作过程-作品成果-经验沉淀”组织，并在作品区标注作者与类型。`,
    },
  };

  const selected = copyByPlatform[platform];
  return {
    title: selected.title,
    body: selected.body,
    tags: activity.tags,
    layout: selected.layout,
  };
}
