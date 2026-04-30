# Promo LayoutPlan 接入说明

## LayoutPlan 是什么

`LayoutPlan` 是 AI 宣发生成结果里的结构化排版计划。它不替代原来的文案字段，而是在现有 `title`、`body`、`tags`、`layoutAdvice`、`matchedAssets` 之外，补充标题断行、素材角色、正文分段、平台专属页面结构、字体装饰和导出尺寸建议。

当前 `PromoDraft` 的核心结构是：

```ts
{
  activityId,
  platform,
  style,
  title,
  body,
  tags,
  layoutAdvice,
  matchedAssets,
  layoutPlan,
  updatedAt
}
```

## DeepSeek 如何返回

`/api/generate-promo` 仍然要求 DeepSeek 返回兼容旧页面的字段：

```json
{
  "title": "",
  "body": "",
  "tags": [],
  "layoutAdvice": "",
  "matchedAssets": [],
  "layoutPlan": {}
}
```

`layoutPlan` 中重点包含：

- `titlePlan`：标题原文、断行、强调词、标题布局。
- `assetPlan`：每张素材的角色、用途、优先级、裁切建议。
- `contentPlan`：正文按 hook、过程、作品成果、总结等结构拆分。
- `xiaohongshuPlan`：小红书封面、分页、标签和符号风格。
- `wechatPlan`：公众号文章结构、长图分段和图文配对。
- `posterPlan`：海报主视觉、构图和文字块位置。

## Normalize / Fallback 如何工作

所有 AI 返回内容都会经过 `lib/promoLayoutPlan.ts` 里的 normalize：

- 如果 `layoutPlan` 缺失，自动生成完整 fallback。
- 如果 `templateRecommendation.templateId` 不存在，会按平台安全映射到现有模板。
- 如果 `assetPlan` 缺少图片、作者或类型，会从当前活动素材中补齐。
- 小红书 fallback 必有 `xiaohongshuPlan`。
- 公众号 fallback 必有 `wechatPlan`。
- 海报/图片排版 fallback 必有 `posterPlan`。
- QQ 空间和 Lofter 至少有 `titlePlan`、`assetPlan`、`contentPlan`。

模板 fallback 规则：

- 小红书：`redbook-cover`，不可用时退到 `redbook-grid`。
- 公众号：`wechat-review`，不可用时退到 `wechat-works`。
- 海报：`poster-birthday`。
- QQ 空间 / Lofter：`poster-collection`，不可用时退到 `poster-birthday`。

## /promo 如何保存

`/promo` 在点击“让小记重新生成”后，会把接口返回的 `layoutPlan` 传给 `buildPromoDraft()` 并保存进：

```ts
ourchive_promo_draft_${activityId}
```

如果接口没有返回有效 `layoutPlan`，`buildPromoDraft()` 会基于当前活动、平台、风格、文案和匹配素材生成默认计划。

活动优先级：

1. URL query 的 `activity` 参数。
2. 当前 draft 的 `activityId`。
3. 当前 draft 的 `activity.id`。
4. fallback 到 `reimu-birthday`。

当前实现中 `/promo` 和 `/promo/editor` 都优先使用 URL query 解析活动，并用 activity 专属 sessionStorage key，避免不同活动草稿互相覆盖。

## /promo/editor 如何消费

编辑器预览已经实际使用 `layoutPlan`：

- 标题按 `titlePlan.titleLines` 断行。
- `titlePlan.highlightWords` 会在标题里加粗并变色强调。
- 主图优先使用 `assetPlan` 中 `role="hero"` 或 `usage="main-visual"` 的素材。
- 多图素材按 `assetPlan.priority` 排序。
- 模板默认选择来自 `templateRecommendation.templateId`，并经过安全 fallback。
- 小红书模板使用 `xiaohongshuPlan.pagePlan`、`hashtagStrategy`、`symbolStyle`。
- 公众号模板使用 `wechatPlan.longImageSections` 生成分段结构。
- 其他模板使用 `contentPlan` 和 `posterPlan` 的主视觉安排。

PNG 下载仍然使用原来的 `html2canvas + previewRef` 机制。导出区域新增样式优先使用十六进制颜色和普通 rgba，避免 `lab()` / `oklch()` 这类 html2canvas 不稳定支持的颜色函数。

## 两阶段实现

第一阶段已经完成结构化接入与基础模板响应：

- `layoutPlan` 类型、normalize、fallback。
- API 返回与 fallback。
- `/promo` 保存。
- `/promo/editor` 基于计划改变标题、素材、模板和平台结构。

第二阶段可以继续做更精细的多页渲染：

- 小红书九宫格或多页导出。
- 公众号完整长图编辑。
- 海报构图组件化。
- 字体、装饰、裁切策略更细粒度地映射到真实控件。
