import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getDefaultMatchedAssetsForActivity, getPromoActivity, getPromoActivityDataForRequest } from "@/lib/promoActivities";
import { getPromoCopy, type PromoPlatform, type PromoStyle } from "@/lib/promoData";
import { buildDefaultLayoutPlan, normalizeLayoutPlan, type LayoutPlan, type PromoLayoutAsset } from "@/lib/promoLayoutPlan";

type GeneratePromoRequest = {
  platform?: string;
  style?: string;
  activityId?: string;
  activityData?: object;
};

type PromoMatchedAsset = {
  id?: string;
  title: string;
  type: string;
  author: string;
  reason: string;
  image?: string;
};

type PromoResult = {
  title: string;
  body: string;
  tags: string[];
  layoutAdvice: string;
  matchedAssets: PromoMatchedAsset[];
  layoutPlan: LayoutPlan;
};

const platformSet = new Set<PromoPlatform>(["QQ空间", "小红书", "Lofter", "公众号"]);
const styleSet = new Set<PromoStyle>(["同好群口吻", "文艺", "活泼", "官方"]);

function readPlatform(value?: string): PromoPlatform {
  return value && platformSet.has(value as PromoPlatform) ? (value as PromoPlatform) : "QQ空间";
}

function readStyle(value?: string): PromoStyle {
  return value && styleSet.has(value as PromoStyle) ? (value as PromoStyle) : "同好群口吻";
}

function getFallback(payload: GeneratePromoRequest): PromoResult {
  const activity = getPromoActivity(payload.activityId);
  const copy = getPromoCopy(readPlatform(payload.platform), readStyle(payload.style), activity);
  const matchedAssets = getDefaultMatchedAssetsForActivity(activity).map((asset) => ({
    id: asset.id,
    title: asset.title,
    type: asset.type,
    author: asset.author ?? "",
    reason: asset.description ?? "适合用于当前活动的宣发素材。",
    image: asset.image,
  }));
  return {
    title: copy.title,
    body: copy.body,
    tags: copy.tags,
    layoutAdvice: copy.layout,
    matchedAssets,
    layoutPlan: buildDefaultLayoutPlan({
      activity,
      assets: matchedAssets,
      body: copy.body,
      platform: readPlatform(payload.platform),
      style: readStyle(payload.style),
      tags: copy.tags,
      title: copy.title,
    }),
  };
}

function normalizeMatchedAssets(value: unknown, payload: GeneratePromoRequest): PromoMatchedAsset[] {
  if (!Array.isArray(value)) return getFallback(payload).matchedAssets;

  const assets = value
    .map((asset) => {
      if (!asset || typeof asset !== "object") return null;
      const candidate = asset as Partial<PromoMatchedAsset>;
      if (typeof candidate.title !== "string" || typeof candidate.type !== "string") return null;

      const normalized: PromoMatchedAsset = {
        id: typeof candidate.id === "string" ? candidate.id : undefined,
        title: candidate.title,
        type: candidate.type,
        author: typeof candidate.author === "string" ? candidate.author : "",
        reason: typeof candidate.reason === "string" ? candidate.reason : "适合用于当前平台的宣发素材。",
        image: typeof candidate.image === "string" ? candidate.image : undefined,
      };
      return normalized;
    })
    .filter((asset): asset is PromoMatchedAsset => asset !== null)
    .slice(0, 4);

  return assets.length > 0 ? assets : getFallback(payload).matchedAssets;
}

function normalizePromoResult(value: unknown, payload: GeneratePromoRequest): PromoResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<PromoResult>;
  if (
    typeof candidate.title !== "string" ||
    typeof candidate.body !== "string" ||
    !Array.isArray(candidate.tags) ||
    typeof candidate.layoutAdvice !== "string"
  ) {
    return null;
  }

  const matchedAssets = normalizeMatchedAssets(candidate.matchedAssets, payload);
  const fallbackPlan = buildDefaultLayoutPlan({
    activity: getPromoActivity(payload.activityId),
    assets: matchedAssets as PromoLayoutAsset[],
    body: candidate.body,
    platform: readPlatform(payload.platform),
    style: readStyle(payload.style),
    tags: candidate.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 8),
    title: candidate.title,
  });

  return {
    title: candidate.title,
    body: candidate.body,
    tags: candidate.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 8),
    layoutAdvice: candidate.layoutAdvice,
    matchedAssets,
    layoutPlan: normalizeLayoutPlan(candidate.layoutPlan, fallbackPlan, getPromoActivity(payload.activityId)),
  };
}

function parsePromoContent(content: string, payload: GeneratePromoRequest): PromoResult {
  try {
    const parsed = JSON.parse(content);
    return normalizePromoResult(parsed, payload) ?? getFallback(payload);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return getFallback(payload);
    }

    try {
      const parsed = JSON.parse(match[0]);
      return normalizePromoResult(parsed, payload) ?? getFallback(payload);
    } catch {
      return getFallback(payload);
    }
  }
}

function buildSystemPrompt() {
  return `你是 OURchive 的群小记，负责把社群活动记录、作品素材和成员贡献整理成适合不同平台的宣发文案。你的语气像一个懂同好社群的记录员，不要写成企业宣传稿。
你的任务不是写企业宣传稿，而是把一次社群共创活动中沉淀的活动记录、作品素材、成员贡献与群体情绪，转化为适合不同平台发布的宣发文案和排版建议。

你熟悉以下平台语气：

1. QQ空间：
- 面向熟人、同好和群友；
- 语气自然、亲近，有“大家一起完成了什么”的社群感；
- 可以使用轻微口语、感谢、贴贴、围观、催稿等群内语感；
- 不要像广告，不要太正式；
- 重点突出：群友一起完成、创作过程、成员贡献、纪念感。

2. 小红书：
- 标题要抓人，有情绪点和分享感；
- 文案短句分段，适合滑动阅读；
- 标签明确，能帮助被搜索；
- 可以更轻快、更有“想安利给别人看”的感觉；
- 重点突出：这个活动为什么有趣、为什么值得收藏、作品亮点是什么。

3. Lofter：
- 面向同人创作者和作品读者；
- 语气更文艺、更沉浸；
- 强调角色、创作氛围、作品之间的呼应；
- 不要过度营销；
- 重点突出：同人创作氛围、角色生日、图文接力、作品情绪。

4. 公众号：
- 结构化活动回顾；
- 语气清楚、完整、可归档；
- 适合社团/社群对外展示；
- 需要有活动缘起、过程、成果、成员贡献、后续沉淀；
- 不要太口语，不要标题党。

你必须基于用户提供的活动数据生成内容。
如果信息不足，只能基于已有信息合理组织，不要编造不存在的作品、人物或活动。
输出必须是合法 JSON，不要 Markdown，不要解释。`;
}

function buildUserPrompt(payload: GeneratePromoRequest) {
  const activity = getPromoActivity(payload.activityId);
  const activityData = payload.activityData ?? getPromoActivityDataForRequest(activity);
  return `请为以下活动生成一套适合「${payload.platform ?? "QQ空间"}」平台发布的宣发文案。
目标风格是：「${payload.style ?? "同好群口吻"}」。

请严格根据平台特点调整文案：

如果 platform 是 QQ空间：
- 标题自然亲近，不要标题党；
- 正文像群友发空间回顾，强调“大家一起完成”；
- 可以感谢认领、催稿、贴贴、围观的同好；
- 标签不需要太多，3-5 个即可；
- 排版建议要适合 QQ空间图文动态。

如果 platform 是 小红书：
- 标题要更抓人，有情绪张力；
- 正文短句分段，前 2 句要吸引人；
- 标签要明确，适合搜索；
- 排版建议要强调首图、封面、短句、标签；
- 可以有轻微 emoji，但不要过度。

如果 platform 是 Lofter：
- 标题和正文要更有同人创作氛围；
- 语言可以更文艺、沉浸；
- 强调角色生日、图文接力、作品之间的呼应；
- 不要过度营销，不要小红书口吻；
- 标签使用同人圈常见表达。

如果 platform 是 公众号：
- 标题清楚，适合活动回顾；
- 正文结构化，可以包含“活动缘起 / 创作过程 / 作品成果 / 经验沉淀”；
- 语气正式但不要企业化；
- 排版建议要适合公众号推送结构。

活动数据：
${JSON.stringify(activityData, null, 2)}

请返回严格 JSON：
{
  "title": "",
  "body": "",
  "tags": [],
  "layoutAdvice": "",
  "matchedAssets": [],
  "layoutPlan": {}
}

字段要求：
- title：只给一个最推荐标题。
- body：根据平台生成正文，不要太短。
- tags：3-8 个标签，按平台习惯调整。
- layoutAdvice：给出具体排版建议，不要泛泛而谈。
- matchedAssets：推荐 2-4 个最适合该平台的素材，并说明原因。每个素材包含 title、type、author、reason。
- layoutPlan：返回结构化排版计划，包含 version、platform、layoutCategory、visualStyle、templateRecommendation、titlePlan、assetPlan、contentPlan、typographyHint、decorationHint、exportHint。小红书必须包含 xiaohongshuPlan，公众号必须包含 wechatPlan。assetPlan 要判断素材 role、priority、usage、cropHint。

禁止：
- 不要输出 Markdown。
- 不要使用 \`\`\`json。
- 不要编造不存在的作品。
- 不要出现“本公司”“用户增长”“商业转化”等企业词。
- 不要把所有平台都写成同一种语气。`;
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Missing DEEPSEEK_API_KEY",
        message: "请在 .env.local 中配置 DEEPSEEK_API_KEY 后重启开发服务器。",
      },
      { status: 500 },
    );
  }

  let payload: GeneratePromoRequest;
  try {
    payload = (await request.json()) as GeneratePromoRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON", message: "请求内容不是合法 JSON。" }, { status: 400 });
  }

  const client = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey,
  });

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(payload),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(getFallback(payload));
    }

    return NextResponse.json(parsePromoContent(content, payload));
  } catch (error) {
    console.error("DeepSeek promo generation failed:", error);
    return NextResponse.json(getFallback(payload));
  }
}
