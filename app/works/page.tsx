"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Avatar, PageFrame, SimpleHeader } from "@/components/ourchive";
import { avatarImages, coreActivity, works, type Work } from "@/lib/mockData";
import { archiveWorkAssets } from "@/lib/archiveWorks";
import { myProjectsWorks } from "@/lib/myProjectsManifest";
import { reimuBirthdayWorks } from "@/lib/reimuBirthdayAssets";
import { getUploadedWorksServerSnapshot, getUploadedWorksSnapshot, parseUploadedWorksSnapshot, subscribeUploadedWorks, uploadedWorkToWork } from "@/lib/uploadedWorks";

const filters = ["全部", "开场插画", "短篇文字", "漫画分镜", "表情包", "小插图", "短篇栏目", "封面分镜", "插画", "摄影"];

const reimuBirthdayLikes = [44, 18, 24, 31, 28, 56, 37, 22, 26, 63];

const reimuBirthdayComments = [
  [
    "南枝：清晨光感好舒服，真的有一种神社刚醒过来的感觉。",
    "阿璃：这张很适合当合辑开场图，氛围一下就出来了。",
    "未央：灵梦这个表情好温柔，和生日主题很搭。",
    "小满：背景细节好多，赛钱箱和花瓣都很加分。",
    "青禾：感觉可以直接放到宣发首图。",
  ],
  [
    "河童：草稿也好完整，能看出一开始就想好了主视觉。",
    "小周：构图上人物和神社背景的比例挺稳的。",
    "夜雀：这种过程稿放进活动记录里很有意义。",
    "阿璃：标题区域预留得很清楚，后面做封面也方便。",
    "未央：看草稿能看到作品一步步长出来，挺有参与感。",
  ],
  [
    "小满：线稿细节量好大，衣服褶皱和背景都很耐看。",
    "青禾：这张线稿单独放出来也能当作品了。",
    "河童：好适合做成填色活动的素材。",
    "南枝：线条很干净，神社背景透视也很稳。",
    "夜雀：感觉上色前已经很有完成度了。",
  ],
  [
    "阿璃：这封信好温柔，像真的从神社寄出来的一样。",
    "墨团：文字和版面搭在一起很舒服，不只是普通短篇。",
    "小满：最后一句有点戳我，生日祝福感很足。",
    "青禾：适合放在合辑中间当情绪转场。",
    "南枝：这个信纸设计也好看，和插画放一起很统一。",
  ],
  [
    "夜雀：四格节奏很清楚，看到最后一格会笑出来。",
    "小周：这个分镜如果细化成成稿应该很可爱。",
    "墨团：赛钱箱旁边过生日这个点真的很灵梦。",
    "小满：表情变化好明显，故事感有了。",
    "未央：可以放在合辑里当轻松段落。",
  ],
  [
    "青禾：赛钱呢这张可以直接进群表情吧www",
    "阿璃：表情包太适合群聊用了，生日活动之后还能继续用。",
    "夜雀：收到礼物那张好可爱！",
    "河童：这个比普通贺图更有社群感，大家会一直发。",
    "小周：建议马上导入群表情。",
  ],
  [
    "未央：生日蛋糕放在赛钱箱旁边这个构思太会了。",
    "南枝：红白配色很统一，一眼就知道是灵梦生日。",
    "阿璃：这个小插图很适合放在活动预告卡上。",
    "小满：蜡烛和御守细节好丰富。",
    "夜雀：看起来像真的在神社办了生日会。",
  ],
  [
    "墨团：这个清单页很像大家一起准备生日企划的证据。",
    "河童：把作品类型都列出来以后，活动结构一下清楚了。",
    "青禾：很适合放进活动记录馆，不只是结果还有过程。",
    "小满：小贴纸和勾选框好可爱。",
    "阿璃：这个页面可以当合辑目录用。",
  ],
  [
    "南枝：封面规划好专业，标题区和主视觉都想到了。",
    "未央：这个分镜能看出合辑不是随便拼起来的。",
    "河童：参考色和版式说明很有用，后面排版会省很多事。",
    "小周：感觉可以直接给宣发编辑页当参考。",
    "墨团：很喜欢这种把设计过程也记录下来的感觉。",
  ],
  [
    "小满：看到封面突然有一种活动真的完成了的感觉。",
    "青禾：这个适合作为活动记录馆的头图。",
    "夜雀：把插画、文字、漫画、贴纸都收进来了，好完整。",
    "南枝：很像一本真的同好合辑。",
    "未央：大家的作品放在一起之后好有纪念感。",
  ],
];

const reimuBirthdayWallWorks: Work[] = reimuBirthdayWorks.map((work, index) => ({
  id: `reimu-birthday-${index + 1}`,
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
  comments: reimuBirthdayComments[index]?.length ?? 0,
  likes: reimuBirthdayLikes[index] ?? 20,
  commentList: reimuBirthdayComments[index] ?? [],
  tags: [...work.tags],
  gradient: work.gradient,
  image: work.image,
  description: work.description,
  activityId: "reimu-birthday",
  sourceType: "activity-generated",
}));

const archiveWallWorks: Work[] = archiveWorkAssets.map((asset) => ({
  id: asset.id,
  title: asset.title,
  type: asset.type,
  author: asset.author,
  authorId: asset.authorId,
  avatar: asset.avatar,
  avatarSrc:
    asset.authorId === "motuan"
      ? avatarImages.motuan
      : asset.authorId === "weiyang"
        ? avatarImages.weiyang
        : asset.authorId === "ali"
          ? avatarImages.ali
          : undefined,
  activity: asset.activityTitle,
  comments: asset.comments.length,
  likes: asset.likes,
  commentList: asset.comments,
  tags: [...asset.tags],
  gradient: asset.gradient,
  image: asset.image,
  description: asset.description,
  activityId: asset.activityId,
  sourceType: "activity-generated",
}));

export default function WorksPage() {
  const [filter, setFilter] = useState("全部");
  const uploadedWorksSnapshot = useSyncExternalStore(subscribeUploadedWorks, getUploadedWorksSnapshot, getUploadedWorksServerSnapshot);
  const allWorks = useMemo<Work[]>(() => {
    const uploaded = parseUploadedWorksSnapshot(uploadedWorksSnapshot).map(uploadedWorkToWork);
    const uploadedIds = new Set(uploaded.map((work) => work.id));
    const reimuTitles = new Set(reimuBirthdayWallWorks.map((work) => work.title));
    const archiveTitles = new Set(archiveWallWorks.map((work) => work.title));
    const reimuWorks = reimuBirthdayWallWorks.filter((work) => !uploadedIds.has(work.id));
    const archiveWorksFiltered = archiveWallWorks.filter((work) => !uploadedIds.has(work.id));
    const knownIds = new Set([...uploadedIds, ...reimuWorks.map((work) => work.id), ...archiveWorksFiltered.map((work) => work.id)]);
    const myProjects = myProjectsWorks.filter((work) => !knownIds.has(work.id));
    const finalKnownIds = new Set([...knownIds, ...myProjects.map((work) => work.id)]);
    const otherDefaultWorks = works.filter((work) => !finalKnownIds.has(work.id) && !reimuTitles.has(work.title) && !archiveTitles.has(work.title));
    return [...uploaded, ...reimuWorks, ...archiveWorksFiltered, ...myProjects, ...otherDefaultWorks];
  }, [uploadedWorksSnapshot]);
  const shown = filter === "全部" ? allWorks : allWorks.filter((work) => work.type === filter);

  return (
    <PageFrame>
      <SimpleHeader title="社群作品墙" backHref="/" backLabel="返回群聊" right={<span className="text-xs text-slate-400">点击作者头像可跳转模拟QQ空间</span>} />
      <main className="min-h-[calc(100vh-96px)] bg-[#edf5fb] p-6">
        <section className="mb-5 rounded-[18px] bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">社群作品墙</h1>
          <p className="mt-2 text-sm text-slate-500">把群聊里散落的灵感、草稿和成品，整理成可以继续传播的社群资产。</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === item ? "bg-[#12b7f5] text-white" : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {shown.map((work) => (
            <InteractiveWorkCard key={work.id} work={work} />
          ))}
        </div>
      </main>
    </PageFrame>
  );
}

function InteractiveWorkCard({ work }: { work: Work }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(work.likes ?? 0);
  const [comments, setComments] = useState(work.commentList ?? []);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const spaceHref = `/space/${work.authorId ?? "motuan"}`;

  function toggleLike() {
    setLiked((current) => {
      setLikes((count) => count + (current ? -1 : 1));
      return !current;
    });
  }

  function sendComment() {
    const next = draft.trim();
    if (!next) return;

    setComments((current) => [...current, `我：${next}`]);
    setDraft("");
    setExpanded(true);
  }

  const visibleComments = expanded ? comments : comments.slice(0, 2);
  const hasMoreComments = comments.length > 2;

  return (
    <div className="overflow-hidden rounded-[14px] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`grid h-36 place-items-center bg-gradient-to-br ${work.gradient} bg-cover bg-center text-sm font-bold text-white`}
        style={work.image ? { backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.12), rgba(124, 58, 237, 0.16)), url(${work.image})` } : undefined}
      >
        {work.type}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">{work.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{work.activity}</p>
          </div>
          <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-600">{work.type}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link href={spaceHref} className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600">
            <Avatar label={work.avatar} src={work.avatarSrc} className="size-8 rounded-full" />
            {work.author}
          </Link>
          <span className="text-xs text-slate-400">{comments.length} 条留言</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {work.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
        {work.authorizationText || work.syncedToQzone ? (
          <div className="mt-3 space-y-1 rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
            {work.authorizationText ? <p>{work.authorizationText}</p> : null}
            {work.syncedToQzone ? <p>已同步到QQ空间</p> : null}
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={toggleLike}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${liked ? "bg-rose-100 text-rose-600" : "bg-white text-slate-600 hover:text-rose-500"}`}
            >
              {liked ? "♥ 已点赞" : "♡ 点赞"} {likes}
            </button>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">评论 {comments.length}</span>
          </div>

          <div className={`${expanded ? "max-h-48 overflow-y-auto pr-1" : ""} mt-3 space-y-2`}>
            {visibleComments.length > 0 ? (
              visibleComments.map((comment, index) => (
                <p key={`${work.id}-${comment}-${index}`} className="rounded-xl bg-white px-3 py-2 text-xs leading-5 text-slate-600">
                  {comment}
                </p>
              ))
            ) : (
              <p className="rounded-xl bg-white px-3 py-2 text-xs leading-5 text-slate-500">还没有评论，来写第一条反馈吧。</p>
            )}
          </div>

          {hasMoreComments ? (
            <button type="button" onClick={() => setExpanded((current) => !current)} className="mt-2 text-xs font-semibold text-sky-600 hover:text-sky-500">
              {expanded ? "收起评论" : `展开全部 ${comments.length} 条评论`}
            </button>
          ) : null}

          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendComment();
              }}
              placeholder="写点反馈给创作者…"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-sky-300"
            />
            <button type="button" onClick={sendComment} className="rounded-xl bg-[#12b7f5] px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-500">
              发送
            </button>
          </div>
        </div>

        <Link href={spaceHref} className="mt-3 inline-flex text-xs font-semibold text-sky-600 hover:text-sky-500">
          去QQ空间看更多 →
        </Link>
      </div>
    </div>
  );
}
