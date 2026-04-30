# 灵梦生日作品素材接入说明

## 素材放置位置

图片素材统一放在：

```text
public/works/reimu-birthday/
```

网站引用时不要写 `public`，应从站点根路径开始：

```text
/works/reimu-birthday/xxx.png
```

## 文件对应作品

| 文件名 | 作品 | 作者 | 类型 |
| --- | --- | --- | --- |
| `reimu_shrine_morning_final.png` | 《神社清晨的灵梦》 | 墨团 | 开场插画 |
| `reimu_shrine_morning_sketch.png` | 《神社清晨的灵梦》构图草稿 | 墨团 | 构图草稿 / 过程稿 |
| `reimu_shrine_morning_lineart.png` | 《神社清晨的灵梦》线稿 | 墨团 | 线稿 / 过程稿 |
| `shrine_letter_weiyang.png` | 《神社来信》 | 未央 | 短篇文字 / 信件页 |
| `birthday_manga_storyboard.png` | 《生日小漫画分镜》 | 阿璃 | 漫画分镜 |
| `reimu_birthday_sticker_sheet.png` | 《灵梦生日表情包》 | 小满 | 表情包 |
| `birthday_cake_by_saisenbako.png` | 《赛钱箱旁边的生日蛋糕》 | 青禾 | 小插图 |
| `gift_checklist_page.png` | 《礼物清单》 | 夜雀 | 短篇栏目 / 清单页 |
| `anthology_cover_storyboard.png` | 《合辑封面分镜》 | 阿璃 | 封面分镜 |
| `reimu_birthday_anthology_cover.png` | 《灵梦生日图文接力合辑》 | 阿璃 / 群体共创 | 合辑封面 |

## 替换图片

如果要替换某张作品图片，直接覆盖 `public/works/reimu-birthday/` 下的同名文件即可。文件名不变时，不需要改代码。

## 作品墙排序

`/works` 作品墙展示顺序：

1. 当前会话上传作品
2. 灵梦生日活动作品
3. 我的个人作品导入
4. 其他默认作品

灵梦生日活动作品路径是：

```text
public/works/reimu-birthday/
```

我的个人作品导入路径是：

```text
public/demo-uploads/my-projects/
```

## 新增作品需要改哪里

当前灵梦生日作品素材的统一数据源是：

- `lib/reimuBirthdayAssets.ts`

新增作品时，优先在这个文件里补充标题、作者、类型、图片路径、渐变兜底和说明。以下页面或数据文件会引用这些数据：

- `lib/mockData.ts`：作品墙与聊天首页相关 mock 数据。
- `lib/archiveActivities.ts`：活动记录馆与 `/archive/reimu-birthday` 详情。
- `lib/promoData.ts`：AI 宣发页的作品素材与推荐图片。
- `lib/promoDraft.ts`：宣发编辑器默认匹配素材。
- `app/activity/page.tsx`：活动详情页创作成果和过程稿附件。
- `app/promo/editor/page.tsx`：宣发模板编辑页的模板配图顺序。
- `app/page.tsx`：聊天首页右侧近期作品。

## 注意事项

- `public` 下的文件引用时不需要写 `public`。
- 不要写成 `/public/works/...`。
- 正确路径是 `/works/reimu-birthday/xxx.png`。
- 文件名尽量使用英文小写、数字和下划线。
- 页面使用背景图叠加渐变底色；图片暂时不存在时会保留渐变占位，避免出现破图图标。
