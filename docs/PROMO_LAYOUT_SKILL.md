# OURchive 群小记宣发排版 Skill

## 1. 核心原则

群小记不是直接生成最终图片，而是生成结构化 Layout Plan。前端模板负责稳定渲染，用户再基于模板做二次编辑和导出。

排版链路是：

活动档案
→ 文案生成
→ Layout Plan
→ 模板渲染
→ 用户二次编辑
→ 下载 PNG

核心原则：

1. 内容优先，模板服务内容。
2. 平台差异优先，不同平台不能套同一套视觉。
3. 图片有角色：主图、辅图、过程图、细节图。
4. 标题必须断行，不能硬塞一整行。
5. 信息密度要控制，封面不展示过多作品。
6. AI 负责排版决策，前端负责稳定渲染。
7. 用户必须能二次编辑标题、正文、标签和图片。

## 2. 三类排版类型

OURchive 只保留三类核心模板。

### 2.1 首图 + 文案

适用：

- QQ空间
- 小红书

特点：

- 一张主视觉图；
- 低透明度蒙版；
- 标题断行；
- 少量标签；
- 正文不塞进图里，而是放在右侧文案区；
- 小红书正文提供分页/符号建议。

规则：

- 封面只使用一张主图；
- 不在首图里展示具体活动作品缩略图；
- 标题最多 2-4 行；
- 重点词需要加粗、变色或做色块；
- 标签最多 3 个；
- 副标题不超过 24 字；
- 小红书封面比例建议 3:4；
- QQ空间封面可以使用 4:5 或 16:9 的宽松比例。

### 2.2 氛围海报

适用：

- Lofter
- 活动纪念图
- 同人活动氛围展示

特点：

- 单张主图；
- 低透明度遮罩；
- 大标题；
- 诗性副标题；
- 少量活动信息；
- 不做信息列表；
- 不做作品缩略图拼贴。

规则：

- 标题优先展示情绪，而不是信息；
- 副标题可以更文艺；
- 标签最多 3 个；
- 底部可放 OURchive / 群小记整理 / 活动时间；
- 使用主图或合辑封面作为背景；
- 不要出现企业宣传语气。

### 2.3 图文长图

适用：

- 公众号

特点：

- 长条结构；
- 图文穿插；
- 强调逻辑顺序；
- 需要有章节；
- 图片必须和对应段落有关。

标准结构：

1. 头图 / 标题区
2. 导语
3. 活动缘起
4. 创作过程
5. 作品成果
6. 经验沉淀
7. 结尾说明

规则：

- 每个章节有标题；
- 每个章节最多对应 1-3 张图；
- 过程稿放在“创作过程”；
- 最终作品放在“作品成果”；
- 经验总结可以用文字卡片；
- 公众号更关注结构清晰，不追求标题党。

## 3. 平台映射规则

QQ空间 → 首图 + 文案
小红书 → 首图 + 文案
Lofter → 氛围海报
公众号 → 图文长图

如果用户已经在 /promo 选择了平台，进入 /promo/editor 后直接默认选中对应模板。

不要让用户在一堆重复模板里重新选择。

## 4. 标题排版规则

titlePlan 字段：

- rawTitle
- titleLines
- highlightWords
- subtitle
- eyebrow
- titleLayout

规则：

1. 标题必须断行。
2. 每行建议 4-12 个汉字。
3. 标题不超过 4 行。
4. highlightWords 必须在模板中被强调。
5. 小红书标题可以更抓人。
6. 公众号标题要清楚，不要标题党。
7. Lofter 标题偏文艺。
8. QQ空间标题偏熟人动态。

示例：

rawTitle:
东方同好群的24h生日接力也太有爱了吧

titleLines:

- 东方同好群的
- 24h生日接力
- 也太有爱了吧

highlightWords:

- 24h生日接力
- 有爱

## 5. 图片角色规则

assetPlan 的 role 包括：

- hero：主视觉
- support：辅助图
- detail：细节图
- process：过程图
- cover：封面图
- ending：结尾图

使用规则：

1. 首图 + 文案：
   只使用 hero 或 cover。
   不使用多图拼贴。

2. 氛围海报：
   只使用 hero。
   如无 hero，使用 priority 最高图片。

3. 图文长图：
   - 活动缘起：cover / hero
   - 创作过程：process
   - 作品成果：support / detail
   - 经验沉淀：可以无图或使用 ending

4. 图片不存在时：
   使用渐变占位，不允许破图。

5. 图片排序：
   assetPlan.priority 越小越靠前。

## 6. 小红书正文规则

小红书不只是封面，还要提供正文排版建议。

xiaohongshuPlan 需要包含：

- hook
- bodyParagraphs
- highlightBullets
- ending
- pagePlan
- symbolStyle
- hashtagStrategy

规则：

1. 正文要短句分段。
2. 前两句必须有吸引力。
3. 可以使用少量 emoji 或符号。
4. 推荐符号：
   ✦ / ♡ / · / ～
5. 每段不要太长。
6. 标签放在结尾，也可以在封面底部展示前三个。
7. pagePlan 建议：
   - 第 1 页：封面
   - 第 2 页：活动亮点
   - 第 3 页：作品成果
   - 第 4 页：创作者贡献
   - 第 5 页：总结与标签

注意：
当前 Demo 阶段可以只渲染首图，但右侧需要展示正文分页建议。

## 7. 公众号长图规则

wechatPlan 需要包含：

- articleStructure
- longImageSections
- imageTextPairing
- endingModule

规则：

1. 公众号强调“图文对应关系”。
2. 不要把图片随机塞进长图。
3. 每个 section 要说明为什么配这张图。
4. 章节顺序要稳定：
   - 活动缘起
   - 创作过程
   - 作品成果
   - 经验沉淀
5. 图片和文字对应：
   - 头图：活动整体视觉；
   - 过程稿：创作过程；
   - 最终作品：作品成果；
   - 评论/总结：经验沉淀。

## 8. 海报规则

海报使用 posterPlan。

规则：

1. 只放一张主图。
2. 使用低透明度蒙版。
3. 标题大，正文少。
4. 不展示活动作品缩略图。
5. 不写长段落。
6. 视觉层级：
   - 第一层：主图
   - 第二层：标题
   - 第三层：副标题
   - 第四层：活动时间/标签/来源
7. 信息密度低于小红书和公众号。
8. 海报要像纪念图，不像活动详情页。

## 9. 模板渲染规则

/promo/editor 三个模板：

1. 首图 + 文案
templateId: cover-copy

渲染：

- 使用 hero 图做背景；
- 添加半透明蒙版；
- 渲染 titleLines；
- highlightWords 强调；
- 渲染 subtitle；
- 渲染前三个 tags；
- 正文放右侧，不塞进图里。

2. 氛围海报
templateId: mood-poster

渲染：

- 使用 hero 图做背景；
- 更大标题；
- 更少标签；
- 文案更诗性；
- 底部放 OURchive 与活动时间。

3. 图文长图
templateId: article-longform

渲染：

- 顶部 title；
- 导语；
- 按 wechatPlan.longImageSections 渲染图文模块；
- 每段有 sectionTitle；
- 图片与正文穿插；
- 结尾显示 endingModule。

## 10. 右侧编辑面板规则

右侧显示：

1. 文案草稿
   - 标题
   - 正文
   - 标签

2. 小记排版计划
   - 推荐模板
   - 标题断行
   - 重点词
   - 主视觉
   - 图片角色
   - 正文结构

3. 已匹配素材
   - 缩略图
   - 标题
   - 作者
   - 用途
   - pairingReason

用户可以编辑：

- 标题
- 正文
- 标签
- 图片选择

## 11. 导出 PNG 规则

1. 只导出中间模板预览区域。
2. 不导出左侧模板列表。
3. 不导出右侧文案面板。
4. 导出区域不要使用 lab()/oklch()。
5. 使用 hex 颜色。
6. 图片使用 public 本地路径。
7. 如图片缺失，用渐变占位。
8. 下载按钮文案：
   下载 PNG
   正在导出...
   PNG 已保存
   导出失败，请稍后重试

## 12. Prompt 接入规则

/api/generate-promo 的 prompt 应引用这些规则。

DeepSeek 返回：

{
  "title": "",
  "body": "",
  "tags": [],
  "layoutAdvice": "",
  "matchedAssets": [],
  "layoutPlan": {}
}

layoutPlan 必须包含：

- titlePlan
- assetPlan
- contentPlan
- templateRecommendation
- typographyHint
- decorationHint
- exportHint

如果是小红书：
必须包含 xiaohongshuPlan。

如果是公众号：
必须包含 wechatPlan。

如果是海报/Lofter：
必须包含 posterPlan。

如果缺失：
normalizeLayoutPlan 必须补全。

## 13. 设计验收标准

最终页面必须达到：

1. QQ空间 / 小红书：
   默认进入“首图 + 文案”。
   封面只用一张主图 + 蒙版 + 标题。

2. Lofter：
   默认进入“氛围海报”。
   更像纪念海报，不像详情页。

3. 公众号：
   默认进入“图文长图”。
   有章节，有图文对应。

4. 所有模板：
   - 使用 titleLines；
   - 使用 highlightWords；
   - 使用 assetPlan priority；
   - 使用正确 activity；
   - 不串成灵梦生日；
   - PNG 可下载。
