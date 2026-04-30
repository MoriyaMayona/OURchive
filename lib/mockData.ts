import { reimuBirthdayImages, reimuBirthdayWorks } from "@/lib/reimuBirthdayAssets";

export type Conversation = {
  id: number;
  name: string;
  avatar: string;
  avatarSrc?: string;
  message: string;
  time: string;
  unread?: number;
  active?: boolean;
};

export type ChatMessage = {
  id: number;
  author: string;
  avatar: string;
  avatarSrc?: string;
  time: string;
  content: string;
  role?: "管理员" | "画手" | "写手" | "策划" | "技术" | "群小记";
  self?: boolean;
  adminOnly?: boolean;
  attachment?: {
    title: string;
    description: string;
    gradient: string;
    tag?: string;
    image?: string;
  };
};

export type Work = {
  id: number | string;
  title: string;
  type: string;
  author: string;
  authorId?: string;
  avatar: string;
  avatarSrc?: string;
  activity: string;
  comments: number;
  likes?: number;
  commentList?: string[];
  tags: string[];
  gradient: string;
  image?: string;
  description?: string;
  authorizationText?: string;
  syncedToQzone?: boolean;
  activityId?: string;
  sourceType?: "uploaded" | "activity-generated" | "my-projects" | "mock";
};

export type SpacePost = {
  title: string;
  content: string;
  activity: string;
  likes: number;
  comments: number;
  gradient: string;
  image?: string;
};

export type SpaceAuthor = {
  id: string;
  name: string;
  avatar: string;
  avatarSrc?: string;
  title: string;
  signature: string;
  tags: string[];
  coverGradient: string;
  latest: string;
  representativeWorks: string[];
  posts: SpacePost[];
};

export type Activity = {
  id: number;
  title: string;
  date: string;
  desc: string;
};

export const currentGroup = {
  name: "东方南堂界遇｜同好创作群",
  members: 536,
  role: "管理员",
  avatarSrc: "/avatars/group-main.png",
};

export const avatarImages = {
  admin: "/avatars/admin.png",
  groupMain: "/avatars/group-main.png",
  groupPhoto: "/avatars/group-photo.png",
  groupCalligraphy: "/avatars/group-calligraphy.png",
  groupGame: "/avatars/group-game.png",
  groupDesign: "/avatars/group-design.png",
  weiyang: "/avatars/weiyang.png",
  nanzhi: "/avatars/nanzhi.png",
  ali: "/avatars/ali.png",
  xiaozhou: "/avatars/xiaozhou.png",
  motuan: "/avatars/motuan.png",
};

export const coreActivity = {
  title: "灵梦生日图文接力活动",
  time: "5月6日 20:00 - 5月7日 20:00",
  format: "图文接力创作",
  description:
    "为灵梦生日准备一次24小时图文接力创作。成员可以用插画、短篇文字、设定图、表情包、小漫画等形式参与，最终整理成一份生日纪念合辑。",
  shortDescription: "围绕灵梦生日进行24小时图文接力，最终整理成生日纪念合辑。",
  participants: 12,
};

export const conversations: Conversation[] = [
  {
    id: 1,
    name: currentGroup.name,
    avatar: "档",
    avatarSrc: avatarImages.groupMain,
    message: "群小记识别到一个活动策划，等待管理员确认",
    time: "21:48",
    unread: 3,
    active: true,
  },
  { id: 2, name: "SJTU摄影同好会", avatar: "摄", avatarSrc: avatarImages.groupPhoto, message: "周六外拍路线更新啦", time: "20:16" },
  { id: 3, name: "书画社活动群", avatar: "书", avatarSrc: avatarImages.groupCalligraphy, message: "宣纸和颜料我都带到活动室", time: "昨天", unread: 1 },
  { id: 4, name: "校园独立游戏工坊", avatar: "游", avatarSrc: avatarImages.groupGame, message: "新版本交互稿已上传", time: "周二" },
  { id: 5, name: "设计作品互评小组", avatar: "设", avatarSrc: avatarImages.groupDesign, message: "今晚要不要一起改图？", time: "周一" },
  { id: 6, name: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali, message: "帮我看看这张构图", time: "周一" },
  { id: 7, name: "小周", avatar: "周", avatarSrc: avatarImages.xiaozhou, message: "灵梦表情包草稿我先发你", time: "4/28" },
];

export const chatMessages: ChatMessage[] = [
  { id: 1, author: "南枝", avatar: "南", avatarSrc: avatarImages.nanzhi, role: "策划", time: "4.29 21:28", content: "灵梦生日快到了，要不要做一次图文接力？形式轻一点，大家有空就参加。" },
  { id: 2, author: "夜雀", avatar: "夜", time: "4.29 21:29", content: "先让我吃完夜宵再想灵梦生日（表情包：抱碗.jpg）" },
  { id: 3, author: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan, role: "画手", time: "4.29 21:30", content: "可以啊，插画、短篇、表情包、小漫画都能参加吧？" },
  { id: 4, author: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali, role: "画手", time: "4.30 12:06", content: "我刚交完作业，感觉灵魂已经被吸走了。" },
  { id: 5, author: "南枝", avatar: "南", avatarSrc: avatarImages.nanzhi, role: "策划", time: "4.30 12:10", content: "那我们定成 24 小时图文接力？最后整理成一份生日纪念合辑。" },
  { id: 6, author: "小周", avatar: "周", avatarSrc: avatarImages.xiaozhou, role: "技术", time: "4.30 12:12", content: "可以，群里消息太多的话我怕后面找不到投稿。" },
  { id: 7, author: "群小记", avatar: "小记", role: "群小记", time: "4.30 12:14", content: "我从群聊里抓到一组活动策划：灵梦生日图文接力活动。建议先确认时间、形式、投稿规则与署名授权。" },
  { id: 8, author: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan, role: "画手", time: "5.01 20:00", content: "我认领开场插画《神社清晨的灵梦》，想画灵梦早上打开神社门的画面。" },
  { id: 9, author: "河童", avatar: "河", role: "技术", time: "5.01 20:02", content: "这标题好有画面感。" },
  { id: 10, author: "夜雀", avatar: "夜", time: "5.01 20:04", content: "灵梦：今天也没有香火钱。" },
  { id: 11, author: "未央", avatar: "央", avatarSrc: avatarImages.weiyang, role: "写手", time: "5.02 18:40", content: "那我接一篇短篇《神社来信》，写灵梦收到大家礼物之前的独白。" },
  { id: 12, author: "小满", avatar: "满", role: "画手", time: "5.02 18:42", content: "这个可以，我已经脑补到她拆礼物的时候嘴硬了。" },
  { id: 13, author: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali, role: "画手", time: "5.02 21:15", content: "封面可以不要太满，红白配色加一点神社木纹，标题留白多一点会更像纪念合辑。" },
  { id: 14, author: "小满", avatar: "满", role: "画手", time: "5.03 22:15", content: "我先做《灵梦生日表情包》第一版草稿，想放几个“生日快乐”“赛钱箱空了”之类的梗。" },
  { id: 15, author: "小满", avatar: "满", role: "画手", time: "5.03 22:16", content: "[表情包] 赛钱箱空了.jpg" },
  { id: 16, author: "路人甲", avatar: "路", time: "5.04 00:10", content: "有人明天去食堂三楼吗？听说新出了抹茶布丁。" },
  { id: 17, author: "青禾", avatar: "青", role: "画手", time: "5.04 16:20", content: "我补一张《赛钱箱旁边的生日蛋糕》小插图，尺寸可以小一点，放在合辑中段。" },
  { id: 18, author: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan, role: "画手", time: "5.04 16:22", content: "好可爱，这张可以放在短篇后面当小过渡。" },
  { id: 19, author: "夜雀", avatar: "夜", role: "写手", time: "5.04 21:00", content: "我想加一个《礼物清单》栏目，大家每个人写一句送给灵梦的礼物说明，感觉很有同好感。" },
  { id: 20, author: "河童", avatar: "河", role: "技术", time: "5.05 19:30", content: "如果最后素材够，我可以做《灵梦生日合辑网页预览》，把插画、短篇和表情包串起来。" },
  { id: 21, author: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali, role: "画手", time: "5.05 19:32", content: "河童老师启动了，大家快交素材。" },
  { id: 22, author: "南枝", avatar: "南", avatarSrc: avatarImages.nanzhi, role: "策划", time: "5.06 19:40", content: "今晚20:00正式开始接力！大家发稿时记得写清楚：作品名、作者名、作品类型、是否最终稿。" },
  { id: 23, author: "小周", avatar: "周", avatarSrc: avatarImages.xiaozhou, role: "技术", time: "5.06 19:42", content: "收到，我先把投稿格式贴一下。" },
  { id: 24, author: "小周", avatar: "周", avatarSrc: avatarImages.xiaozhou, role: "技术", time: "5.06 19:43", content: "投稿格式：作品名 / 作者名 / 类型 / 是否最终稿 / 是否允许进入活动记录。" },
  { id: 25, author: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan, role: "画手", time: "5.06 20:30", content: "《神社清晨的灵梦》线稿细化完成了，先发一版过程稿。" },
  {
    id: 26,
    author: "墨团",
    avatar: "墨",
    avatarSrc: avatarImages.motuan,
    role: "画手",
    time: "5.06 20:31",
    content: "作品附件卡",
    attachment: {
      title: "《神社清晨的灵梦》线稿",
      description: "开场插画 / 线稿 / 过程稿",
      gradient: "from-rose-100 via-red-100 to-amber-100",
      tag: "过程稿",
      image: reimuBirthdayImages.shrineMorningLineart,
    },
  },
  { id: 27, author: "未央", avatar: "央", avatarSrc: avatarImages.weiyang, role: "写手", time: "5.07 00:15", content: "《神社来信》写完前半段了，后面想接到大家送礼物的场景。" },
  { id: 28, author: "夜雀", avatar: "夜", time: "5.07 00:17", content: "半夜写文的人都有一种神秘力量。" },
  { id: 29, author: "小满", avatar: "满", role: "画手", time: "5.07 12:00", content: "表情包补了两个新表情，一个是“今天不除妖”，一个是“赛钱箱生日特供”。" },
  {
    id: 30,
    author: "小满",
    avatar: "满",
    role: "画手",
    time: "5.07 12:02",
    content: "作品附件卡",
    attachment: {
      title: "《灵梦生日表情包》半成品",
      description: "表情包 / 新增两枚 / 半成品",
      gradient: "from-sky-100 via-fuchsia-100 to-rose-100",
      tag: "半成品",
      image: reimuBirthdayImages.stickerSheet,
    },
  },
  { id: 31, author: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali, role: "画手", time: "5.07 15:30", content: "我做了一张封面分镜，感觉可以用红白色块分割，把作品列表放在右下角。" },
  {
    id: 32,
    author: "阿璃",
    avatar: "璃",
    avatarSrc: avatarImages.ali,
    role: "画手",
    time: "5.07 15:31",
    content: "作品附件卡",
    attachment: {
      title: "《合辑封面分镜》",
      description: "封面候选 / 红白配色 / 排版草图",
      gradient: "from-red-100 via-white to-slate-200",
      tag: "封面候选",
      image: reimuBirthdayImages.anthologyStoryboard,
    },
  },
  { id: 33, author: "河童", avatar: "河", role: "技术", time: "5.07 19:40", content: "网页预览结构已经搭好了，等最终稿齐了就能放进去。" },
  { id: 34, author: "路人甲", avatar: "路", time: "5.07 19:41", content: "刚刚那个抹茶布丁真的一般，不推荐。" },
  { id: 35, author: "南枝", avatar: "南", avatarSrc: avatarImages.nanzhi, role: "策划", time: "5.07 20:00", content: "接力收稿啦！辛苦大家，后面会把这次活动整理成完整记录。" },
  { id: 36, author: "你", avatar: "管", avatarSrc: avatarImages.admin, role: "管理员", time: "5.07 20:01", content: "我来负责收稿和排版吧，小记先帮我抓一下活动信息。", self: true },
  { id: 37, author: "群小记", avatar: "小记", role: "群小记", time: "5.07 20:02", content: "我帮你从群聊里抓到这些重点啦：活动时间线、作品认领、过程稿、半成品和收稿节点。可同步至活动讨论区并生成活动记录。" },
];

export const activityDiscussion: ChatMessage[] = [
  { id: 1, author: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan, time: "20:03", content: "我认领第一棒，画神社清晨的灵梦。" },
  { id: 2, author: "未央", avatar: "央", avatarSrc: avatarImages.weiyang, time: "20:08", content: "第二棒我写短篇，接在开场图后面。" },
  { id: 3, author: "仅管理成员可见", avatar: "管", avatarSrc: avatarImages.admin, time: "20:10", content: "活动结束后统一确认授权和署名。", adminOnly: true },
  { id: 4, author: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali, time: "20:18", content: "合辑封面可以用红白配色，标题留白多一点。" },
];

export const works: Work[] = [
  ...reimuBirthdayWorks
    .filter((work) => !["构图草稿", "线稿", "合辑封面"].includes(work.type))
    .map((work, index) => ({
      id: index + 1,
      title: work.title,
      type: work.type,
      author: work.author,
      authorId: work.authorId,
      avatar: work.avatar,
      avatarSrc:
        work.authorId === "motuan"
          ? avatarImages.motuan
          : work.authorId === "weiyang"
            ? avatarImages.weiyang
            : work.authorId === "ali"
              ? avatarImages.ali
              : undefined,
      activity: coreActivity.title,
      comments: 2,
      likes: [42, 31, 28, 56, 24, 19, 33][index] ?? 20,
      commentList: ["作品已接入真实图片展示。", "适合放进本次生日合辑。"],
      tags: [...work.tags],
      gradient: work.gradient,
      image: work.image,
      description: work.description,
    })),
];

export const spaceAuthors: SpaceAuthor[] = [
  {
    id: "admin",
    name: "我",
    avatar: "管",
    avatarSrc: avatarImages.admin,
    title: "我的QQ空间",
    signature: "管理员在线整理群活动、作品墙和授权记录。",
    tags: ["管理员", "作品整理", "活动归档"],
    coverGradient: "from-sky-200 via-white to-violet-200",
    latest: "我发布了《角色扑克牌设定图》，并同步到群作品墙。",
    representativeWorks: ["《角色扑克牌设定图》"],
    posts: [
      {
        title: "《角色扑克牌设定图》",
        content: "刚刚发布《角色扑克牌设定图》，这张先作为角色扑克牌共创活动的第一版卡面设定。",
        activity: "角色扑克牌共创活动",
        likes: 0,
        comments: 1,
        gradient: "from-sky-200 via-white to-violet-200",
        image: "/demo-uploads/reimu-card-demo.png",
      },
    ],
  },
  {
    id: "motuan",
    name: "墨团",
    avatar: "墨",
    avatarSrc: avatarImages.motuan,
    title: "墨团的QQ空间",
    signature: "画一点红白巫女和神社清晨。",
    tags: ["插画", "主视觉", "红白"],
    coverGradient: "from-rose-200 via-orange-100 to-sky-200",
    latest: "刚完成《红白巫女的晨光》，这次想把神社清晨画得更安静一点。",
    representativeWorks: ["《红白巫女的晨光》", "《神社清晨的灵梦》", "《妖怪们的误会》"],
    posts: [
      { title: "《红白巫女的晨光》", content: "这次想把神社清晨画得更安静一点，像大家刚开始接力时那种轻轻的期待。", activity: coreActivity.title, likes: 128, comments: 36, gradient: "from-rose-200 via-orange-100 to-sky-200" },
      { title: "《神社清晨的灵梦》", content: "开场插画的构图草稿，门口光线和纸垂位置还在调整。", activity: coreActivity.title, likes: 87, comments: 18, gradient: "from-rose-100 via-red-100 to-amber-100" },
      { title: "《妖怪们的误会》", content: "故事接龙里补的一张角色插图，画到最后有点像误会解除现场。", activity: "故事接龙——给定开头的图文续写活动", likes: 64, comments: 12, gradient: "from-rose-100 via-orange-100 to-white" },
    ],
  },
  {
    id: "weiyang",
    name: "未央",
    avatar: "央",
    avatarSrc: avatarImages.weiyang,
    title: "未央的QQ空间",
    signature: "写一些神社、来信和温柔的日常。",
    tags: ["写手", "短篇", "日常"],
    coverGradient: "from-violet-200 via-white to-sky-200",
    latest: "《神社来信》写完啦，想把生日之前那种别扭又温柔的心情留下来。",
    representativeWorks: ["《神社来信》", "《春日长椅上的爱丽丝》", "《今晚不要点灯》"],
    posts: [
      { title: "《神社来信》", content: "写的是灵梦收到大家礼物之前的一点独白，最后还是想让她嘴硬一点。", activity: coreActivity.title, likes: 96, comments: 24, gradient: "from-violet-200 via-white to-sky-200" },
      { title: "《春日长椅上的爱丽丝》", content: "校园明信片配文，照片里的长椅很适合写成一封没有寄出的信。", activity: "角色 in 校园——实景明信片拍摄与绘制活动", likes: 72, comments: 15, gradient: "from-pink-100 via-white to-emerald-100" },
      { title: "《今晚不要点灯》", content: "故事接龙第一章，负责把那个没有署名的开头接住。", activity: "故事接龙——给定开头的图文续写活动", likes: 83, comments: 19, gradient: "from-violet-100 via-white to-sky-100" },
    ],
  },
  {
    id: "ali",
    name: "阿璃",
    avatar: "璃",
    avatarSrc: avatarImages.ali,
    title: "阿璃的QQ空间",
    signature: "封面、分镜、视觉设计都想试试看。",
    tags: ["分镜", "封面", "视觉设计"],
    coverGradient: "from-amber-100 via-pink-100 to-violet-200",
    latest: "《生日小漫画分镜》先放一版节奏稿，等大家作品齐了再统一画面风格。",
    representativeWorks: ["《生日小漫画分镜》", "合辑封面分镜", "《早苗的午后天桥》"],
    posts: [
      { title: "《生日小漫画分镜》", content: "先把阅读节奏定下来，后面再补表情和小道具。", activity: coreActivity.title, likes: 88, comments: 21, gradient: "from-amber-100 via-pink-100 to-violet-200" },
      { title: "合辑封面分镜", content: "红白配色和标题留白都安排上了，希望最后像一本小小纪念册。", activity: coreActivity.title, likes: 74, comments: 16, gradient: "from-red-100 via-white to-slate-200" },
      { title: "《早苗的午后天桥》", content: "天桥照片很适合做斜线构图，午后光线也很温柔。", activity: "角色 in 校园——实景明信片拍摄与绘制活动", likes: 69, comments: 13, gradient: "from-sky-100 via-cyan-100 to-white" },
    ],
  },
  {
    id: "xiaoman",
    name: "小满",
    avatar: "满",
    title: "小满的QQ空间",
    signature: "表情包和Q版小图是精神食粮。",
    tags: ["表情包", "Q版", "小图"],
    coverGradient: "from-cyan-100 via-sky-200 to-fuchsia-100",
    latest: "《灵梦表情包草稿》先发一版，赛钱箱空了这个梗真的越画越好笑。",
    representativeWorks: ["《灵梦表情包草稿》", "《灵梦生日表情包》", "《食堂门口的妖梦》"],
    posts: [
      { title: "《灵梦表情包草稿》", content: "先画了几枚群里能马上用的，生日快乐和赛钱箱空了必须有。", activity: coreActivity.title, likes: 143, comments: 41, gradient: "from-cyan-100 via-sky-200 to-fuchsia-100" },
      { title: "《灵梦生日表情包》", content: "正式版会再补两枚小表情，想做成群表情包。", activity: coreActivity.title, likes: 101, comments: 27, gradient: "from-sky-100 via-fuchsia-100 to-rose-100" },
      { title: "《食堂门口的妖梦》", content: "校园明信片里的 Q 版小图，食堂门口真的很适合偶遇。", activity: "角色 in 校园——实景明信片拍摄与绘制活动", likes: 76, comments: 18, gradient: "from-rose-100 via-orange-100 to-amber-100" },
    ],
  },
];

export function getSpaceAuthor(authorId: string) {
  return spaceAuthors.find((author) => author.id === authorId);
}

export const recentActivities: Activity[] = [
  { id: 1, date: "3.15", title: "水灯节场贩", desc: "摊位物料、交换无料与夜拍记录" },
  { id: 2, date: "3.28", title: "歌牌对战活动", desc: "线上房间、战报和二创梗图归档" },
  { id: 3, date: "4.06", title: "夜樱头像接龙", desc: "春季头像企划与作品墙整理" },
];

export const members = [
  { name: "管理员", avatar: "管", avatarSrc: avatarImages.admin, admin: true },
  { id: "nanzhi", name: "南枝", avatar: "南", avatarSrc: avatarImages.nanzhi, role: "策划" },
  { name: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan },
  { name: "未央", avatar: "央", avatarSrc: avatarImages.weiyang },
  { name: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali },
  { name: "小周", avatar: "周", avatarSrc: avatarImages.xiaozhou },
  { name: "小满", avatar: "满" },
  { name: "青禾", avatar: "青" },
];

export const archiveSummary = {
  timeline: ["5月6日 20:00 开启接力与认领", "5月7日 12:00 中场进度交换", "5月7日 20:00 收稿并整理生日合辑"],
  highlights: ["开场图完成度高，适合作为宣发头图", "短篇与漫画内容可组成连续阅读动线", "表情包草稿适合二次传播"],
  learnings: ["活动规则越轻，参与门槛越低", "提前确认署名和授权能减少后期返工", "作品墙与QQ空间同步能放大社群成就感"],
};
