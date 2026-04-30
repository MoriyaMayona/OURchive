import { avatarImages, coreActivity } from "@/lib/mockData";
import { getReimuBirthdayImage, reimuBirthdayImages } from "@/lib/reimuBirthdayAssets";
import type { PromoActivityData } from "@/lib/promoActivities";

export type PromoPlatform = "QQ空间" | "小红书" | "Lofter" | "公众号";
export type PromoStyle = "同好群口吻" | "文艺" | "活泼" | "官方";

export type PromoCopy = {
  title: string;
  body: string;
  tags: string[];
  layout: string;
};

export type PromoImage = {
  id: string;
  title: string;
  type: string;
  gradient: string;
  motif: string;
  image?: string;
};

export type PromoWork = {
  title: string;
  author: string;
  type: string;
  image?: string;
};

export const promoPlatforms: PromoPlatform[] = ["QQ空间", "小红书", "Lofter", "公众号"];
export const promoStyles: PromoStyle[] = ["同好群口吻", "文艺", "活泼", "官方"];

export const promoActivity = {
  name: coreActivity.title,
  time: "4.29 - 5.07",
  format: "24小时图文接力",
  source: "群聊讨论 + 活动讨论区 + 作品草稿",
};

export const promoMembers = [
  { name: "南枝", role: "策划管理员", avatar: "南", avatarSrc: avatarImages.nanzhi },
  { name: "墨团", role: "美术管理员", avatar: "墨", avatarSrc: avatarImages.motuan },
  { name: "未央", role: "写手", avatar: "央", avatarSrc: avatarImages.weiyang },
  { name: "阿璃", role: "画手", avatar: "璃", avatarSrc: avatarImages.ali },
  { name: "小满", role: "画手", avatar: "满" },
  { name: "青禾", role: "画手", avatar: "青" },
  { name: "夜雀", role: "写手", avatar: "夜" },
  { name: "河童", role: "技术", avatar: "河" },
  { name: "小周", role: "归档管理员", avatar: "周", avatarSrc: avatarImages.xiaozhou },
  { name: "我", role: "管理员", avatar: "管", avatarSrc: avatarImages.admin },
];

export const promoWorks: PromoWork[] = [
  { title: "《神社清晨的灵梦》", author: "墨团", type: "开场插画", image: reimuBirthdayImages.shrineMorningFinal },
  { title: "《神社清晨的灵梦》构图草稿", author: "墨团", type: "构图草稿", image: reimuBirthdayImages.shrineMorningSketch },
  { title: "《神社清晨的灵梦》线稿", author: "墨团", type: "线稿", image: reimuBirthdayImages.shrineMorningLineart },
  { title: "《神社来信》", author: "未央", type: "短篇文字", image: reimuBirthdayImages.shrineLetter },
  { title: "《生日小漫画分镜》", author: "阿璃", type: "漫画分镜", image: reimuBirthdayImages.mangaStoryboard },
  { title: "《灵梦生日表情包》", author: "小满", type: "表情包", image: reimuBirthdayImages.stickerSheet },
  { title: "《赛钱箱旁边的生日蛋糕》", author: "青禾", type: "小插图", image: reimuBirthdayImages.birthdayCake },
  { title: "《礼物清单》", author: "夜雀", type: "短篇栏目", image: reimuBirthdayImages.giftChecklist },
  { title: "《合辑封面分镜》", author: "阿璃", type: "封面分镜", image: reimuBirthdayImages.anthologyStoryboard },
  { title: "《灵梦生日图文接力合辑》", author: "阿璃 / 群体共创", type: "合辑封面", image: reimuBirthdayImages.anthologyCover },
];

export const promoImages: PromoImage[] = [
  {
    id: "morning",
    title: "《神社清晨的灵梦》",
    type: "开场插画",
    gradient: "from-rose-200 via-red-100 to-sky-200",
    motif: "首图 / 主视觉",
    image: reimuBirthdayImages.shrineMorningFinal,
  },
  {
    id: "sticker",
    title: "《灵梦生日表情包》",
    type: "表情包草稿",
    gradient: "from-cyan-100 via-sky-200 to-fuchsia-100",
    motif: "轻松氛围 / 社群感",
    image: reimuBirthdayImages.stickerSheet,
  },
  {
    id: "cake",
    title: "《赛钱箱旁边的生日蛋糕》",
    type: "小插图",
    gradient: "from-amber-100 via-rose-100 to-emerald-100",
    motif: "生日主题补充图",
    image: reimuBirthdayImages.birthdayCake,
  },
  {
    id: "cover-storyboard",
    title: "《合辑封面分镜》",
    type: "封面分镜",
    gradient: "from-red-100 via-white to-slate-200",
    motif: "过程稿 / 封面整理",
    image: reimuBirthdayImages.anthologyStoryboard,
  },
  {
    id: "anthology-cover",
    title: "《灵梦生日图文接力合辑》",
    type: "合辑封面",
    gradient: "from-rose-200 via-white to-sky-200",
    motif: "宣发封面 / 合辑主视觉",
    image: reimuBirthdayImages.anthologyCover,
  },
];

export function getPromoImageForTitle(title: string) {
  return getReimuBirthdayImage(title) ?? promoImages.find((image) => image.title === title)?.image;
}

const styleLine: Record<PromoStyle, string> = {
  同好群口吻: "这次更像大家一起把零散灵感慢慢拼成了一份生日礼物，认领、催稿、吐槽和补图都被好好留下来了。",
  文艺: "从神社清晨的门缝到生日蛋糕旁的红白色块，一次接力把同好之间的心意折进了合辑里。",
  活泼: "从一句“要不要做接力”开始，到线稿、短篇、表情包和封面分镜齐刷刷到位，群友行动力真的拉满。",
  官方: "本次活动围绕灵梦生日展开，完成了策划、作品认领、过程稿提交、素材整理与收稿归档等环节。",
};

export function getPromoCopy(platform: PromoPlatform, style: PromoStyle, activity?: PromoActivityData): PromoCopy {
  if (activity) {
    const workLine = activity.works.map((item) => `${item.author}：${item.title}｜${item.type}`).join("、");
    const stylePrefix: Record<PromoStyle, string> = {
      同好群口吻: "这次活动从一句轻轻的提议开始，最后被大家一点点补成了可以好好收藏的社群记录。",
      文艺: "一些灵感沿着同一条线索慢慢展开，最后留下了属于这次活动的共同切片。",
      活泼: "从想法冒头到素材刷齐，大家的行动力这次真的拉满了。",
      官方: "本次活动完成了策划、素材征集、作品整理与宣发归档等环节，形成了可复用的社群活动记录。",
    };
    const baseBody = `${stylePrefix[style]}\n\n${activity.summary}\n\n本次推荐展示的素材包括：${workLine}。\n\n这些作品和记录可以继续用于活动回顾、成员展示与后续宣发。`;
    const copies: Record<PromoPlatform, PromoCopy> = {
      QQ空间: {
        title: `${activity.name}整理好啦｜这次大家一起留下了新的活动记录`,
        body: baseBody,
        tags: activity.tags,
        layout: `${activity.layoutAdvice} QQ空间适合用自然分段，最后补一句感谢参与和围观的成员。`,
      },
      小红书: {
        title: `这个同好群活动也太会整理了｜${activity.name}`,
        body: `${activity.summary}\n\n这次最适合先看：${activity.works.slice(0, 3).map((item) => item.title).join("、")}。\n\n从素材到归档都被认真留下来了，适合做成一组可滑动的活动回顾图。`,
        tags: activity.tags,
        layout: `${activity.layoutAdvice} 小红书建议首图突出活动主题，后续用短句拆分作品亮点和成员贡献。`,
      },
      Lofter: {
        title: `${activity.name}｜一次被认真留下的共创记录`,
        body: `${stylePrefix.文艺}\n\n${activity.summary}\n\n${activity.works.map((item) => `${item.title}（${item.author}）`).join("、")}彼此接住，让这次活动不只是一组作品，也是一段共同完成的创作过程。`,
        tags: activity.tags,
        layout: `${activity.layoutAdvice} Lofter适合保留作品标题、作者署名和简短前言，让读者按作品情绪顺序阅读。`,
      },
      公众号: {
        title: `活动回顾｜${activity.name}`,
        body: `活动概况：${activity.summary}\n\n创作与整理：本次活动围绕「${activity.format}」展开，素材来源包括${activity.source}。\n\n作品成果：${workLine}。\n\n经验沉淀：后续可继续完善署名、授权、物料复盘和可复用模板，让活动记录更易归档与传播。`,
        tags: activity.tags,
        layout: `${activity.layoutAdvice} 公众号建议按“活动概况-创作过程-作品成果-经验沉淀”组织，并在作品区标注作者与类型。`,
      },
    };
    return copies[platform];
  }

  const bodyLead = styleLine[style];
  const copies: Record<PromoPlatform, PromoCopy> = {
    QQ空间: {
      title: "灵梦生日图文接力完成啦｜大家一起送给红白巫女的生日礼物",
      body: `${bodyLead}\n\n4.29 开始策划，5.07 正式收稿。墨团的《神社清晨的灵梦》、未央的《神社来信》、小满的表情包、青禾的小插图，还有封面分镜和网页预览一起组成了这次生日纪念合辑。\n\n谢谢每一位参与和围观的同好，创作被看见，过程也被 OURchive 好好沉淀。`,
      tags: ["#东方Project", "#灵梦生日", "#图文接力"],
      layout: "先放合辑封面，再按接力顺序展示插画、短篇、表情包和小插图，最后补成员感谢。",
    },
    小红书: {
      title: "东方同好群的24h生日接力也太有爱了吧😭",
      body: `${bodyLead}\n\n一个群聊里的生日企划能有多认真？从开场插画到短篇文字，从表情包到合辑封面，大家把灵梦生日做成了一份可翻阅的社群记忆。\n\n喜欢这种轻轻开始、认真完成的共创感。`,
      tags: ["#同人创作", "#东方Project", "#社群共创", "#生日企划"],
      layout: "首图放完成度最高的插画，正文用短句分段，后续图片按“作品图-过程稿-成员名单”排列。",
    },
    Lofter: {
      title: "灵梦生日图文接力｜写给红白巫女的一份群像贺礼",
      body: `${bodyLead}\n\n本次接力从 4.29 的活动设想到 5.07 的收稿整理，成员以插画、短篇、表情包、小插图与网页预览共同完成生日合辑。\n\n愿每一份灵感都保留署名，也愿每一次同好共创都能被温柔归档。`,
      tags: ["#博丽灵梦", "#东方project", "#同人企划"],
      layout: "保留作者署名和作品顺序，适合把正文写成活动记录式前言，作品图之间加入短句说明。",
    },
    公众号: {
      title: "活动回顾｜灵梦生日图文接力活动记录",
      body: `${bodyLead}\n\n本次活动由东方南堂界遇同好创作群发起，围绕灵梦生日进行 24 小时图文接力。活动沉淀了开场插画、短篇文字、表情包、小插图、礼物清单、封面分镜与网页预览等素材。\n\n后续将继续整理作品授权、署名信息与活动经验，形成可复用的社群活动记录。`,
      tags: ["活动回顾", "社团共创", "作品沉淀"],
      layout: "按“活动缘起-创作过程-作品展示-成员感想”组织，并在作品展示区标注作者与类型。",
    },
  };

  return copies[platform];
}

export type PromoTemplate = {
  id: string;
  name: string;
  category: "海报" | "公众号" | "小红书";
  platform: PromoPlatform;
  description: string;
  imageSlots: number;
};

export const promoTemplates: PromoTemplate[] = [
  { id: "poster-birthday", name: "海报｜红白生日贺图", category: "海报", platform: "QQ空间", description: "竖版主视觉，适合发布活动完成纪念。", imageSlots: 1 },
  { id: "poster-collection", name: "海报｜社群接力合辑", category: "海报", platform: "Lofter", description: "多作品拼贴，突出接力与成员共创。", imageSlots: 3 },
  { id: "wechat-review", name: "公众号｜活动回顾长图", category: "公众号", platform: "公众号", description: "结构化活动复盘，适合归档与社团推送。", imageSlots: 2 },
  { id: "wechat-works", name: "公众号｜作品展示推送", category: "公众号", platform: "公众号", description: "作品列表优先，强调作者与素材沉淀。", imageSlots: 3 },
  { id: "redbook-cover", name: "小红书｜首图种草卡", category: "小红书", platform: "小红书", description: "强情绪标题与首图，适合吸引点击。", imageSlots: 1 },
  { id: "redbook-grid", name: "小红书｜九宫格封面卡", category: "小红书", platform: "小红书", description: "方形卡片，多图预览活动亮点。", imageSlots: 3 },
];
