import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, PageFrame } from "@/components/ourchive";
import { getSpaceAuthor, spaceAuthors, type SpaceAuthor, type SpacePost } from "@/lib/mockData";
import { myProjectsSpacePosts, myProjectsWorks } from "@/lib/myProjectsManifest";

type SpaceAuthorPageProps = {
  params: Promise<{ authorId: string }>;
};

type ProjectSpacePost = SpacePost & {
  tags?: string[];
};

export function generateStaticParams() {
  return spaceAuthors.map((author) => ({ authorId: author.id }));
}

export default async function SpaceAuthorPage({ params }: SpaceAuthorPageProps) {
  const { authorId } = await params;
  const baseAuthor = getSpaceAuthor(authorId);

  if (!baseAuthor) notFound();

  const isAdmin = authorId === "admin";
  const author = isAdmin
    ? {
        ...baseAuthor,
        name: "我",
        title: "我的QQ空间",
        signature: "这里存放我自己的东方相关练习和活动作品。",
        tags: ["管理员", "测试账号", "创作者"],
        latest:
          myProjectsWorks.length > 0
            ? `已同步 ${myProjectsWorks.length} 张东方相关个人作品到作品墙和我的QQ空间。`
            : "还没有生成个人作品清单，运行 npm run generate:my-projects 后会显示图片动态。",
        representativeWorks: myProjectsWorks.slice(0, 8).map((work) => work.title),
        posts: myProjectsSpacePosts,
      }
    : baseAuthor;

  return (
    <PageFrame>
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/works" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
            返回作品墙
          </Link>
          <Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
            返回群聊
          </Link>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">模拟QQ空间</span>
      </header>

      <main className="min-h-[calc(100vh-96px)] bg-[#edf5fb] p-6">
        <SpaceHeader author={author} />

        {isAdmin ? <AdminProjectGrid author={author} posts={myProjectsSpacePosts} /> : <AuthorTimeline author={author} />}
      </main>
    </PageFrame>
  );
}

function AuthorTimeline({ author }: { author: SpaceAuthor }) {
  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <LatestPost author={author} />
        <div className="space-y-4">
          {author.posts.map((post) => (
            <article key={`${author.id}-${post.title}`} className="overflow-hidden rounded-[18px] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <Avatar label={author.avatar} src={author.avatarSrc} className="size-10 rounded-full" />
                <div>
                  <h2 className="font-bold text-slate-950">{post.title}</h2>
                  <p className="text-xs text-slate-400">来自 {post.activity}</p>
                </div>
              </div>
              <div
                className={`grid h-56 place-items-center bg-gradient-to-br ${post.gradient} bg-cover bg-center p-6 text-center text-lg font-black text-white`}
                style={post.image ? { backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.12), rgba(124, 58, 237, 0.16)), url(${post.image})` } : undefined}
              >
                <span className="rounded-full bg-white/85 px-4 py-2 text-sm text-slate-700">{post.title}</span>
              </div>
              <div className="p-5">
                <p className="text-sm leading-7 text-slate-600">{post.content}</p>
                <div className="mt-4 flex gap-4 text-sm text-slate-500">
                  <span>赞 {post.likes}</span>
                  <span>评论 {post.comments}</span>
                  <span>转发 {Math.max(3, Math.floor(post.likes / 9))}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <SpaceSidebar author={author} />
    </section>
  );
}

function AdminProjectGrid({ author, posts }: { author: SpaceAuthor; posts: ProjectSpacePost[] }) {
  return (
    <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <LatestPost author={author} />
        <section className="rounded-[18px] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">个人作品动态</h2>
              <p className="mt-1 text-sm text-slate-500">来自 public/demo-uploads/my-projects/ 的东方相关个人作品。</p>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">{posts.length} 张图片</span>
          </div>

          {posts.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {posts.map((post) => (
                <article key={post.title} className="overflow-hidden rounded-[14px] border border-slate-100 bg-slate-50">
                  <div
                    className={`h-48 bg-gradient-to-br ${post.gradient} bg-cover bg-center`}
                    style={post.image ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.1)), url(${post.image})` } : undefined}
                  />
                  <div className="p-4">
                    <h3 className="truncate font-bold text-slate-950">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{post.content}</p>
                    <p className="mt-2 text-xs font-semibold text-sky-600">来源：{post.activity}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(post.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-3 text-xs text-slate-400">
                      <span>赞 {post.likes}</span>
                      <span>评论 {post.comments}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-sm leading-6 text-slate-500">
              还没有个人作品清单。把图片放到 public/demo-uploads/my-projects/ 后运行 npm run generate:my-projects。
            </div>
          )}
        </section>
      </div>

      <SpaceSidebar author={author} />
    </section>
  );
}

function SpaceSidebar({ author }: { author: SpaceAuthor }) {
  return (
    <aside className="space-y-4">
      <section className="rounded-[18px] bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">代表作品</h2>
        <div className="mt-3 space-y-2">
          {author.representativeWorks.map((work) => (
            <div key={work} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
              {work}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[18px] bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">空间标签</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {author.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function SpaceHeader({ author }: { author: SpaceAuthor }) {
  return (
    <section className="overflow-hidden rounded-[20px] bg-white shadow-sm">
      <div className={`h-44 bg-gradient-to-r ${author.coverGradient}`} />
      <div className="-mt-12 flex flex-wrap items-end gap-4 px-6 pb-6">
        <Avatar label={author.avatar} src={author.avatarSrc} className="size-24 rounded-[22px] border-4 border-white" />
        <div className="min-w-0 pb-1">
          <h1 className="text-2xl font-black text-slate-950">{author.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{author.signature}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {author.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestPost({ author }: { author: SpaceAuthor }) {
  return (
    <section className="rounded-[18px] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar label={author.avatar} src={author.avatarSrc} className="size-11 rounded-full" />
        <div>
          <p className="text-xs font-bold text-sky-500">最新动态</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{author.latest}</p>
        </div>
      </div>
    </section>
  );
}
