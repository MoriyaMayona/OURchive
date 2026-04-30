/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(projectRoot, "public", "demo-uploads", "my-projects");
const outputFile = path.join(projectRoot, "lib", "myProjectsManifest.ts");
const supportedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const commentPool = [
  "南枝：这张构图挺有感觉的，角色动作很清楚。",
  "墨团：颜色氛围不错，感觉可以继续细化成完整作品。",
  "未央：这个角色表情很抓人。",
  "阿璃：背景如果再补一点会更完整。",
  "小满：很适合放进个人练习归档。",
  "青禾：这张可以作为以后活动的参考图。",
  "夜雀：线条挺顺的，能看出画的时候很有想法。",
  "河童：这个角度蛮难画的，完成度不错。",
  "小周：人物和道具关系处理得挺自然。",
  "南枝：感觉可以做成系列图。",
];

function buildComments(index) {
  const count = index % 3 === 0 ? 4 : 3;
  return Array.from({ length: count }, (_, offset) => commentPool[(index * 3 + offset) % commentPool.length]);
}

function toTitle(fileName) {
  const parsed = path.parse(fileName);
  return `《${parsed.name.replace(/[-_]+/g, " ").trim()}》`;
}

function toPublicPath(fileName) {
  return `/demo-uploads/my-projects/${encodeURIComponent(fileName)}`;
}

function q(value) {
  return JSON.stringify(value);
}

function buildManifest(files) {
  const works = files.map((fileName, index) => {
    const id = `my-project-${String(index + 1).padStart(3, "0")}`;
    const comments = buildComments(index);
    return {
      id,
      title: toTitle(fileName),
      author: "我",
      authorId: "admin",
      type: "插画",
      source: "个人作品归档",
      activity: "个人作品归档",
      image: toPublicPath(fileName),
      description: "测试账号的东方相关个人作品，已加入群作品墙与个人QQ空间。",
      tags: ["个人作品", "东方", "插画"],
      likes: 0,
      comments,
      commentList: comments,
      authorizedForWall: true,
      authorizedForPromo: true,
      syncedToQzone: true,
      activityId: "personal",
      sourceType: "my-projects",
      gradient: "from-sky-100 via-white to-violet-100",
      avatar: "管",
      avatarSrc: "/avatars/admin.png",
    };
  });

  const lines = [
    'import type { Work } from "@/lib/mockData";',
    "",
    "export type MyProjectWork = Work & {",
    "  source: string;",
    "  authorizedForWall: boolean;",
    "  authorizedForPromo: boolean;",
    "};",
    "",
    "export const myProjectsWorks: MyProjectWork[] = [",
  ];

  for (const item of works) {
    lines.push("  {");
    lines.push(`    id: ${q(item.id)},`);
    lines.push(`    title: ${q(item.title)},`);
    lines.push(`    author: ${q(item.author)},`);
    lines.push(`    authorId: ${q(item.authorId)},`);
    lines.push(`    type: ${q(item.type)},`);
    lines.push(`    source: ${q(item.source)},`);
    lines.push(`    activity: ${q(item.activity)},`);
    lines.push(`    image: ${q(item.image)},`);
    lines.push(`    description: ${q(item.description)},`);
    lines.push(`    tags: ${q(item.tags)},`);
    lines.push(`    likes: ${item.likes},`);
    lines.push(`    comments: ${item.comments.length},`);
    lines.push(`    commentList: ${q(item.commentList)},`);
    lines.push(`    authorizationText: "已授权展示与宣发整理",`);
    lines.push(`    syncedToQzone: ${item.syncedToQzone},`);
    lines.push(`    activityId: ${q(item.activityId)},`);
    lines.push(`    sourceType: ${q(item.sourceType)},`);
    lines.push(`    gradient: ${q(item.gradient)},`);
    lines.push(`    avatar: ${q(item.avatar)},`);
    lines.push(`    avatarSrc: ${q(item.avatarSrc)},`);
    lines.push(`    authorizedForWall: ${item.authorizedForWall},`);
    lines.push(`    authorizedForPromo: ${item.authorizedForPromo},`);
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");
  lines.push("export const myProjectsSpacePosts = myProjectsWorks.map((work) => ({");
  lines.push("  title: work.title,");
  lines.push("  content: work.description ?? \"测试账号的东方相关个人作品。\",");
  lines.push("  activity: work.source,");
  lines.push("  likes: work.likes ?? 0,");
  lines.push("  comments: work.comments,");
  lines.push("  gradient: work.gradient,");
  lines.push("  image: work.image,");
  lines.push("  tags: work.tags,");
  lines.push("}));");
  lines.push("");

  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }

  const files = fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));

  fs.writeFileSync(outputFile, buildManifest(files), "utf8");
  console.log(`Generated ${path.relative(projectRoot, outputFile)} with ${files.length} works.`);
}

main();
