import { avatarImages } from "@/lib/mockData";
import { reimuBirthdayImages, reimuBirthdayWorks } from "@/lib/reimuBirthdayAssets";

export type ArchiveMember = {
  name: string;
  role: string;
  avatar: string;
  avatarSrc?: string;
};

export type ArchiveWork = {
  title: string;
  author: string;
  type: string;
  description: string;
  gradient: string;
  image?: string;
};

export type ArchiveTimelineItem = {
  date: string;
  event: string;
};

export type ArchiveStatus = {
  label: string;
  value: string;
};

export type ArchiveActivity = {
  id: string;
  title: string;
  date: string;
  typeLabels: string[];
  summary: string;
  participantCount: number;
  workCount: number;
  background?: string;
  openingText?: string;
  heroGradient: string;
  heroImage?: string;
  accent: string;
  members: ArchiveMember[];
  works: ArchiveWork[];
  timeline: ArchiveTimelineItem[];
  learnings: string[];
  statuses: ArchiveStatus[];
};

const commonMembers: ArchiveMember[] = [
  { name: "南枝", role: "策划", avatar: "南", avatarSrc: avatarImages.nanzhi },
  { name: "墨团", role: "画手", avatar: "墨", avatarSrc: avatarImages.motuan },
  { name: "未央", role: "写手", avatar: "央", avatarSrc: avatarImages.weiyang },
  { name: "阿璃", role: "画手", avatar: "璃", avatarSrc: avatarImages.ali },
  { name: "小满", role: "画手", avatar: "满" },
  { name: "青禾", role: "画手", avatar: "青" },
  { name: "夜雀", role: "写手", avatar: "夜" },
  { name: "河童", role: "技术", avatar: "河" },
  { name: "小周", role: "归档", avatar: "周", avatarSrc: avatarImages.xiaozhou },
];

const defaultStatuses: ArchiveStatus[] = [
  { label: "作品授权与署名", value: "已整理 / 待确认" },
  { label: "作品类型归档", value: "已整理" },
  { label: "可复用经验", value: "已沉淀" },
  { label: "宣发素材", value: "可整理" },
];

export const archiveActivities: ArchiveActivity[] = [
  {
    id: "reimu-birthday",
    title: "灵梦生日图文接力活动",
    date: "4.29 - 5.07",
    typeLabels: ["图文接力", "生日企划"],
    summary:
      "围绕灵梦生日展开的24小时图文接力，成员用插画、短篇、表情包、小插图与网页预览共同完成生日纪念合辑。",
    participantCount: 12,
    workCount: 10,
    heroGradient: "from-rose-200 via-red-100 to-sky-200",
    heroImage: reimuBirthdayImages.anthologyCover,
    accent: "text-rose-600",
    members: [
      ...commonMembers,
      { name: "管理员", role: "收稿", avatar: "管", avatarSrc: avatarImages.admin },
    ],
    works: reimuBirthdayWorks.map((work) => ({
      title: work.title,
      author: work.author,
      type: work.type,
      description: work.description,
      gradient: work.gradient,
      image: work.image,
    })),
    timeline: [
      { date: "4.29", event: "南枝提出灵梦生日图文接力设想" },
      { date: "4.30", event: "管理组确认活动规则与接力形式" },
      { date: "5.01", event: "墨团认领《神社清晨的灵梦》，并提交构图草稿" },
      { date: "5.02", event: "未央认领《神社来信》，阿璃开始整理合辑封面方向" },
      { date: "5.03", event: "小满提交《灵梦生日表情包》第一版草稿" },
      { date: "5.04", event: "青禾补充《赛钱箱旁边的生日蛋糕》，夜雀确认《礼物清单》栏目" },
      { date: "5.05", event: "阿璃推进《合辑封面分镜》，合辑封面进入整理阶段" },
      { date: "5.06", event: "活动正式开始，开放接力投稿" },
      { date: "5.07", event: "活动收稿，进入作品整理阶段" },
    ],
    learnings: [
      "轻量接力比正式比赛更适合同好群参与。",
      "投稿时要求填写作品名、作者名、类型和授权状态，可以显著降低后期整理成本。",
      "过程稿与最终稿需要分开标注，方便活动记录和作品墙展示。",
      "成员贡献不只体现在最终作品，也包括认领、催稿、补图、整理和围观反馈。",
    ],
    statuses: defaultStatuses,
  },
  {
    id: "campus-postcard",
    title: "角色 in 校园——实景明信片拍摄与绘制活动",
    date: "3.22 - 3.30",
    typeLabels: ["摄影", "插画再创作", "校园实景"],
    summary:
      "成员在校园中拍摄适合角色出没的真实场景，并基于照片进行角色绘制，最终形成一组“角色来到校园”的明信片风格作品。",
    participantCount: 18,
    workCount: 12,
    background:
      "社群希望把同好创作和校园空间结合，让角色不只停留在二次元图像里，而是来到大家每天经过的教学楼、草坪、图书馆和食堂门口。",
    heroGradient: "from-emerald-100 via-sky-100 to-amber-100",
    accent: "text-emerald-600",
    members: commonMembers,
    works: [
      { title: "《灵梦在东区草坪》", author: "青禾", type: "实景插画明信片", description: "把草坪晨光和角色剪影结合，作为第一张明信片主图。", gradient: "from-emerald-100 via-lime-100 to-sky-100" },
      { title: "《魔理沙经过图书馆》", author: "墨团", type: "摄影合成插画", description: "用图书馆台阶做透视基础，补上飞过的魔理沙。", gradient: "from-amber-100 via-white to-sky-100" },
      { title: "《早苗的午后天桥》", author: "阿璃", type: "校园摄影再绘制", description: "天桥栏杆和午后光影被整理成清爽构图。", gradient: "from-sky-100 via-cyan-100 to-white" },
      { title: "《夜晚教学楼与小恶魔》", author: "夜雀", type: "短篇配图", description: "夜景照片搭配一小段校园怪谈式文字。", gradient: "from-indigo-100 via-slate-100 to-violet-100" },
      { title: "《食堂门口的妖梦》", author: "小满", type: "Q版明信片", description: "把日常食堂入口做成轻松的角色偶遇场景。", gradient: "from-rose-100 via-orange-100 to-amber-100" },
      { title: "《春日长椅上的爱丽丝》", author: "未央", type: "文字明信片", description: "用短句给照片补上角色心情。", gradient: "from-pink-100 via-white to-emerald-100" },
      { title: "《校园地图角色贴纸组》", author: "河童", type: "贴纸/地图设计", description: "把点位清单整理成可贴在地图上的小标记。", gradient: "from-cyan-100 via-sky-100 to-violet-100" },
    ],
    timeline: [
      { date: "3.22", event: "发起“角色 in 校园”想法，征集适合拍摄的校园点位" },
      { date: "3.23", event: "成员提交第一批场景照片，包括草坪、图书馆、天桥、教学楼" },
      { date: "3.24", event: "管理员整理点位清单，避免多人重复拍摄同一地点" },
      { date: "3.25", event: "开始角色分配与画面风格讨论" },
      { date: "3.26", event: "第一批草稿上传，形成明信片构图方向" },
      { date: "3.28", event: "成员补充文字说明与角色小故事" },
      { date: "3.30", event: "完成第一版校园明信片合集" },
    ],
    learnings: [
      "实景拍摄活动适合降低新人参与门槛，哪怕不会画画也能贡献素材。",
      "需要提前说明拍摄规范，避免拍到无关路人或敏感信息。",
      "点位清单和角色分配很重要，可以减少重复劳动。",
      "明信片格式比大海报更适合多成员作品统一展示。",
    ],
    statuses: defaultStatuses,
  },
  {
    id: "story-relay",
    title: "故事接龙——给定开头的图文续写活动",
    date: "2.18 - 2.25",
    typeLabels: ["文字接龙", "插图", "漫画"],
    summary:
      "管理组给出一个神社异变开头，成员轮流续写故事，并自由配以插图、漫画分镜和角色设定补充，最后整理成一份群体创作故事集。",
    participantCount: 15,
    workCount: 10,
    background:
      "部分成员更擅长文字或脑洞设定，不一定能长期完成大幅图像作品，因此社群尝试用故事接龙降低创作门槛，让文字、插图和漫画都能自然参与。",
    openingText: "某天清晨，博丽神社门口出现了一封没有署名的信。信纸上只有一句话：今晚不要点灯。",
    heroGradient: "from-violet-100 via-sky-100 to-slate-100",
    accent: "text-violet-600",
    members: commonMembers,
    works: [
      { title: "《今晚不要点灯》", author: "未央", type: "故事第一章", description: "接住给定开头，确定故事的悬疑语气。", gradient: "from-violet-100 via-white to-sky-100" },
      { title: "《无名来信》", author: "夜雀", type: "故事第二章", description: "把悬念引向神社夜巡。", gradient: "from-slate-100 via-indigo-100 to-violet-100" },
      { title: "《灯下的纸鹤》", author: "小满", type: "插图", description: "用小物件补足故事里的关键线索。", gradient: "from-amber-100 via-white to-violet-100" },
      { title: "《神社夜巡分镜》", author: "阿璃", type: "漫画分镜", description: "让后续参与者更容易理解画面节奏。", gradient: "from-sky-100 via-slate-100 to-indigo-100" },
      { title: "《妖怪们的误会》", author: "墨团", type: "角色插图", description: "补出角色关系，也把故事气氛从紧张拉回轻松。", gradient: "from-rose-100 via-orange-100 to-white" },
      { title: "《结尾：天亮之后》", author: "南枝", type: "收束段落", description: "整理设定冲突，把接龙收成完整故事。", gradient: "from-cyan-100 via-white to-amber-100" },
      { title: "《异变角色关系图》", author: "河童", type: "设定图", description: "把已确定设定可视化，方便归档。", gradient: "from-sky-100 via-cyan-100 to-violet-100" },
    ],
    timeline: [
      { date: "2.18", event: "管理组发布故事开头与接龙规则" },
      { date: "2.19", event: "未央认领第一章，确定故事基调" },
      { date: "2.20", event: "夜雀补充第二章，将悬念引向神社夜巡" },
      { date: "2.21", event: "小满上传第一张配图草稿" },
      { date: "2.22", event: "阿璃绘制漫画分镜，帮助统一画面节奏" },
      { date: "2.23", event: "墨团补充角色插图与关系设定" },
      { date: "2.24", event: "南枝讨论结尾收束方式" },
      { date: "2.25", event: "故事接龙完成并归档为图文故事集" },
    ],
    learnings: [
      "给定开头能有效降低创作启动难度。",
      "文字接龙容易产生设定冲突，需要管理员定期整理“目前已确定设定”。",
      "插图和漫画分镜可以帮助后续参与者理解故事走向。",
      "适合把高质量问答与设定讨论沉淀进群小记问答。",
    ],
    statuses: defaultStatuses,
  },
  {
    id: "water-lantern-fair",
    title: "水灯节场贩与招新活动",
    date: "3.10 - 3.15",
    typeLabels: ["线下摊位", "作品展示", "招新"],
    summary:
      "社群围绕校园水灯节设置同好摊位，展示成员作品、交换无料、进行招新，并记录摊位布置、物料准备和现场互动经验。",
    participantCount: 20,
    workCount: 16,
    background:
      "社群希望通过线下场贩把群内创作带到公共空间，让更多同好看到作品，也让新人通过现场交流了解社群氛围。",
    heroGradient: "from-amber-100 via-sky-100 to-indigo-100",
    accent: "text-amber-600",
    members: [
      ...commonMembers,
      { name: "新同好", role: "现场交流", avatar: "新" },
    ],
    works: [
      { title: "《水灯节摊位主视觉》", author: "阿璃", type: "海报/摊位视觉", description: "统一摊位视觉，让路过同好能快速识别主题。", gradient: "from-amber-100 via-orange-100 to-sky-100" },
      { title: "《角色小卡交换组》", author: "小满", type: "无料小卡", description: "适合现场交换和新人留念。", gradient: "from-pink-100 via-white to-amber-100" },
      { title: "《东方灯影贴纸》", author: "青禾", type: "贴纸组", description: "以水灯和角色剪影做轻量周边。", gradient: "from-cyan-100 via-sky-100 to-amber-100" },
      { title: "《摊位布置示意图》", author: "河童", type: "空间规划图", description: "提前确定展示区、交换区和入群二维码位置。", gradient: "from-slate-100 via-sky-100 to-white" },
      { title: "《新人入群指南折页》", author: "南枝", type: "招新说明", description: "用简短说明介绍社群氛围和近期活动。", gradient: "from-emerald-100 via-white to-cyan-100" },
      { title: "《水灯夜拍记录》", author: "墨团", type: "摄影", description: "为后续复盘保留现场布置和人流记忆。", gradient: "from-indigo-100 via-sky-100 to-violet-100" },
      { title: "《现场互动问答整理》", author: "小周", type: "经验记录", description: "把新人常问问题转成后续 FAQ 素材。", gradient: "from-sky-100 via-white to-lime-100" },
    ],
    timeline: [
      { date: "3.10", event: "确认水灯节摊位申请与活动目标" },
      { date: "3.11", event: "管理组整理摊位物料清单" },
      { date: "3.12", event: "成员上传无料小卡、贴纸、海报草稿" },
      { date: "3.13", event: "河童补充摊位动线和布置示意图" },
      { date: "3.14", event: "南枝整理新人入群说明与现场话术" },
      { date: "3.15", event: "水灯节当天完成摊位展示、作品交换与招新" },
      { date: "3.16", event: "管理组补充现场复盘和经验记录" },
    ],
    learnings: [
      "线下活动要提前明确物料负责人、搬运时间和摊位分工。",
      "招新内容需要简洁，最好用“作品展示 + 入群二维码 + 最近活动预告”组合。",
      "现场互动问题很值得沉淀，可转化为新人入群 FAQ。",
      "线下活动照片、摊位图和物料清单对后续复办价值很高。",
    ],
    statuses: defaultStatuses,
  },
];

export function getArchiveActivity(id: string) {
  return archiveActivities.find((activity) => activity.id === id);
}
