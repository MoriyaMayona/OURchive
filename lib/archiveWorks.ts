export type ArchiveWorkAsset = {
  id: string;
  activityId: "campus-postcard" | "story-relay" | "water-lantern-fair";
  activityTitle: string;
  title: string;
  author: string;
  authorId: string;
  avatar: string;
  type: string;
  image: string;
  description: string;
  tags: string[];
  comments: string[];
  likes: number;
  gradient: string;
};

export const archiveWorkAssets: ArchiveWorkAsset[] = [
  {
    id: "campus-postcard-reimu-lawn",
    activityId: "campus-postcard",
    activityTitle: "角色 in 校园——实景明信片拍摄与绘制活动",
    title: "《灵梦在东区草坪》",
    author: "墨团",
    authorId: "motuan",
    avatar: "墨",
    type: "明信片 / 插画再创作",
    image: "/demo-assets/archive-works/campus-postcard-reimu-lawn.png",
    description: "把灵梦放进东区草坪的春日校园场景中，结合实景照片与角色绘制，形成校园纪念明信片风格作品。",
    tags: ["校园明信片", "实景再创作", "灵梦"],
    comments: ["青禾：草坪的光感好舒服，真的像春天路过时会看见的一幕。", "未央：角色放进真实校园里之后，距离感一下子近了。"],
    likes: 38,
    gradient: "from-emerald-100 via-lime-100 to-sky-100",
  },
  {
    id: "campus-postcard-marisa-library",
    activityId: "campus-postcard",
    activityTitle: "角色 in 校园——实景明信片拍摄与绘制活动",
    title: "《魔理沙经过图书馆》",
    author: "未央",
    authorId: "weiyang",
    avatar: "央",
    type: "明信片 / 插画再创作",
    image: "/demo-assets/archive-works/campus-postcard-marisa-library.png",
    description: "以图书馆门口为场景，让魔理沙像普通学生一样穿过校园，突出角色与校园日常的融合。",
    tags: ["校园明信片", "图书馆", "魔理沙"],
    comments: ["墨团：图书馆门口这个点选得好，魔理沙像真的要去借书。", "南枝：很适合作为整组明信片里偏日常的一张。"],
    likes: 34,
    gradient: "from-amber-100 via-white to-sky-100",
  },
  {
    id: "campus-postcard-sanae-skybridge",
    activityId: "campus-postcard",
    activityTitle: "角色 in 校园——实景明信片拍摄与绘制活动",
    title: "《早苗的午后天桥》",
    author: "青禾",
    authorId: "motuan",
    avatar: "青",
    type: "明信片 / 插画再创作",
    image: "/demo-assets/archive-works/campus-postcard-sanae-skybridge.png",
    description: "以校园天桥和午后光线为背景，表现早苗与校园空间之间温柔、轻盈的相遇感。",
    tags: ["校园明信片", "午后天桥", "早苗"],
    comments: ["小满：午后光线太温柔了，这张有种快放学的感觉。", "阿璃：天桥的纵深很好看，适合放在长图中间做过渡。"],
    likes: 36,
    gradient: "from-sky-100 via-cyan-100 to-white",
  },
  {
    id: "story-relay-shrine-incident-opening",
    activityId: "story-relay",
    activityTitle: "故事接龙——给定开头的图文续写活动",
    title: "《神社异变·开端》",
    author: "南枝",
    authorId: "nanzhi",
    avatar: "南",
    type: "开头插图 / 设定图",
    image: "/demo-assets/archive-works/story-relay-shrine-incident-opening.png",
    description: "作为故事接龙的起始图，描绘神社异变发生后的黄昏场景，为后续续写提供悬念和氛围。",
    tags: ["故事接龙", "设定图", "神社异变"],
    comments: ["夜雀：这个黄昏氛围一出来，后面就很想接着写。", "阿璃：开头图信息量刚好，不会把后续发展写死。"],
    likes: 41,
    gradient: "from-violet-100 via-white to-sky-100",
  },
  {
    id: "story-relay-tracker-letter",
    activityId: "story-relay",
    activityTitle: "故事接龙——给定开头的图文续写活动",
    title: "《追迹者的来信》",
    author: "夜雀",
    authorId: "weiyang",
    avatar: "夜",
    type: "短篇文字 / 图文稿",
    image: "/demo-assets/archive-works/story-relay-tracker-letter.png",
    description: "以书信形式续写神社异变线索，结合文字、便签与插图，形成调查记录式的图文作品。",
    tags: ["故事接龙", "书信", "图文稿"],
    comments: ["未央：便签和手写感很有调查记录的味道。", "南枝：这篇把线索往前推了一步，但还留了很多余地。"],
    likes: 33,
    gradient: "from-slate-100 via-indigo-100 to-violet-100",
  },
  {
    id: "story-relay-night-road-comic",
    activityId: "story-relay",
    activityTitle: "故事接龙——给定开头的图文续写活动",
    title: "《夜路四格》",
    author: "阿璃",
    authorId: "ali",
    avatar: "璃",
    type: "漫画 / 四格",
    image: "/demo-assets/archive-works/story-relay-night-road-comic.png",
    description: "用轻松四格漫画的方式续写夜路回神社的开头，把悬疑气氛转化为幽默的接龙互动。",
    tags: ["故事接龙", "四格漫画", "夜路"],
    comments: ["小满：前面还在紧张，最后一格直接笑出来。", "墨团：这种轻松转折很适合接龙活动，气氛活了。"],
    likes: 39,
    gradient: "from-sky-100 via-slate-100 to-indigo-100",
  },
  {
    id: "water-lantern-recruitment-poster",
    activityId: "water-lantern-fair",
    activityTitle: "水灯节场贩与招新活动",
    title: "《水灯节场贩招新海报》",
    author: "河童",
    authorId: "motuan",
    avatar: "河",
    type: "活动海报 / 招新物料",
    image: "/demo-assets/archive-works/water-lantern-recruitment-poster.png",
    description: "用于水灯节场贩与招新的主视觉海报，展示摊位内容、招新对象、活动时间和报名方式。",
    tags: ["水灯节", "招新", "活动海报"],
    comments: ["南枝：信息层级很清楚，现场贴出来应该很好认。", "小周：报名方式和摊位内容放得很顺，后续可以复用这个版式。"],
    likes: 45,
    gradient: "from-amber-100 via-orange-100 to-sky-100",
  },
  {
    id: "water-lantern-free-exchange-table",
    activityId: "water-lantern-fair",
    activityTitle: "水灯节场贩与招新活动",
    title: "《无料交换桌》",
    author: "小满",
    authorId: "motuan",
    avatar: "满",
    type: "摊位记录 / 周边展示",
    image: "/demo-assets/archive-works/water-lantern-free-exchange-table.png",
    description: "记录无料交换桌上的明信片、贴纸、徽章与留言，体现线下同好交流和作品互换氛围。",
    tags: ["水灯节", "无料交换", "周边展示"],
    comments: ["青禾：看到桌面就能想起大家围着交换的那种热闹。", "河童：这些小物件放在一起，很有活动当天的实感。"],
    likes: 37,
    gradient: "from-pink-100 via-white to-amber-100",
  },
  {
    id: "water-lantern-booth-recap",
    activityId: "water-lantern-fair",
    activityTitle: "水灯节场贩与招新活动",
    title: "《夜色摊位记录》",
    author: "青禾",
    authorId: "motuan",
    avatar: "青",
    type: "活动回顾图 / 现场记录",
    image: "/demo-assets/archive-works/water-lantern-booth-recap.png",
    description: "表现水灯节夜色中的摊位互动、成员交流和招新记录，适合作为活动档案封面或公众号回顾图。",
    tags: ["水灯节", "现场记录", "活动回顾"],
    comments: ["未央：夜色和摊位灯光很有记忆点，适合做回顾头图。", "小满：这张能看出大家真的在现场聊起来了。"],
    likes: 42,
    gradient: "from-indigo-100 via-sky-100 to-violet-100",
  },
];

export function getArchiveWorkAssetsByActivity(activityId: string) {
  return archiveWorkAssets.filter((work) => work.activityId === activityId);
}

export function getArchiveHeroImage(activityId: string) {
  return getArchiveWorkAssetsByActivity(activityId)[0]?.image;
}
