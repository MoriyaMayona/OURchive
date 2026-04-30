export type CommunitySource = {
  title: string;
  type: "活动记录" | "投稿规则" | "经验总结";
  description: string;
  href?: string;
};

export type CommunityKnowledge = {
  id: string;
  keywords: string[];
  source: CommunitySource;
  content: string[];
};

export const communityKnowledge: CommunityKnowledge[] = [
  {
    id: "postcard-canvas",
    keywords: ["明信片", "画布", "尺寸", "dpi", "校园"],
    source: {
      title: "群内创作规范 / 角色 in 校园活动经验",
      type: "投稿规则",
      description: "校园明信片活动沉淀出的画布比例、展示尺寸和留白建议。",
      href: "/archive/campus-postcard",
    },
    content: [
      "如果做普通明信片风格，建议使用 1748 x 1240 px 或 2480 x 1748 px，300dpi。",
      "如果后续只做线上展示，1920 x 1080 或 1600 x 1000 也可以。",
      "角色 in 校园活动里，大家最后统一成横版明信片比例，方便作品墙展示。",
      "建议保留出血和标题留白，不要把角色贴到边缘。",
    ],
  },
  {
    id: "relay-submission",
    keywords: ["投稿", "格式", "表情包", "最终稿", "过程稿", "文字稿", "图片"],
    source: {
      title: "灵梦生日图文接力活动记录",
      type: "投稿规则",
      description: "图文接力投稿时需要记录的作品信息、稿件状态和授权范围。",
      href: "/archive/reimu-birthday",
    },
    content: [
      "投稿时写清楚作品名、作者名、作品类型、是否最终稿、是否允许进入活动记录。",
      "过程稿和最终稿要分开标注。",
      "如果是文字稿，建议附上标题和接续位置。",
      "如果是图片，建议说明是否可以用于活动合辑和作品墙展示。",
    ],
  },
  {
    id: "latest-activity",
    keywords: ["上一次", "最近", "什么时候", "最新", "活动"],
    source: {
      title: "灵梦生日图文接力活动记录",
      type: "活动记录",
      description: "最近一次完整归档活动的时间、成果和参与规模。",
      href: "/archive/reimu-birthday",
    },
    content: [
      "最近一次完整归档活动是 2026.04.29 - 2026.05.07 的灵梦生日图文接力活动。",
      "活动围绕灵梦生日展开，产出了插画、短篇、表情包、小插图、礼物清单和网页预览。",
      "参与人数约 12 人，作品数量约 7 件。",
    ],
  },
  {
    id: "similar-activities",
    keywords: ["类似活动", "之前", "做过哪些", "历史", "活动记录馆"],
    source: {
      title: "活动记录馆",
      type: "活动记录",
      description: "社群中过往几类活动的形式和适合参与的成员类型。",
      href: "/archive",
    },
    content: [
      "角色 in 校园活动：实景拍摄 + 角色绘制，适合摄影和插画成员一起参与。",
      "故事接龙活动：基于给定开头续写故事，并配插图、漫画或设定图。",
      "水灯节场贩与招新活动：线下摊位、作品展示、物料准备和招新经验沉淀。",
    ],
  },
  {
    id: "first-relay",
    keywords: ["第一次", "参加", "图文接力", "准备", "新人"],
    source: {
      title: "灵梦生日图文接力活动经验",
      type: "经验总结",
      description: "新人第一次参加图文接力时最该确认的任务、格式和授权信息。",
      href: "/archive/reimu-birthday",
    },
    content: [
      "先确认活动主题、截止时间和投稿格式。",
      "认领自己能完成的小任务，不要一开始就选太大的内容。",
      "准备作品名、作者名、类型和授权范围。",
      "可以先交草稿或构思，管理员会帮忙归档。",
      "不确定就问，不要自己憋着。",
    ],
  },
  {
    id: "plan-activity",
    keywords: ["策划", "组织", "管理员", "活动", "提前准备", "准备什么"],
    source: {
      title: "多次活动经验总结",
      type: "经验总结",
      description: "从图文接力、校园明信片、故事接龙和线下摊位中总结的活动准备清单。",
      href: "/archive",
    },
    content: [
      "先明确活动主题、时间、参与形式和最终产物。",
      "提前准备公告卡片、投稿格式、授权说明、作品收集方式。",
      "活动中要记录认领、草稿、半成品和最终稿。",
      "活动后整理时间线、作品清单、成员贡献和经验总结。",
      "如果要做宣发，再把活动记录交给群小记整理成文案和素材包。",
    ],
  },
  {
    id: "rights-credit",
    keywords: ["授权", "署名", "作品墙", "宣发", "商用", "草稿"],
    source: {
      title: "作品授权与署名规则",
      type: "投稿规则",
      description: "活动结束后进入作品墙、活动记录和宣发素材前需要确认的边界。",
    },
    content: [
      "活动结束后需要确认作品是否允许进入作品墙、活动记录和宣发素材。",
      "商用或对外大范围使用需要单独确认。",
      "署名要按照作者指定名称，不要擅自修改。",
      "草稿、过程稿和最终稿要分别标注。",
    ],
  },
];

export function searchCommunityKnowledge(question: string) {
  const normalized = question.toLowerCase();
  const scored = communityKnowledge
    .map((item) => {
      const score = item.keywords.reduce((total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const selected = scored.length > 0 ? scored.slice(0, 4).map(({ item }) => item) : communityKnowledge.slice(0, 3);
  return selected;
}

export function buildLocalCommunityAnswer(question: string, knowledge = searchCommunityKnowledge(question)) {
  const lines = knowledge.flatMap((item) => item.content).slice(0, 8);
  const intro = "我现在还没连上小记的在线整理能力，但可以先根据本地社群经验给你一个参考：";

  if (lines.length === 0) {
    return `${intro}\n\n这个问题我不太确定，最好问管理员确认一下。可以先把主题、截止时间、投稿格式和授权范围这几件事问清楚，基本不会跑偏。`;
  }

  return `${intro}\n\n${lines.map((line) => `- ${line}`).join("\n")}\n\n先从小任务开始就好，别一上来把自己卷成活动主视觉。`;
}
