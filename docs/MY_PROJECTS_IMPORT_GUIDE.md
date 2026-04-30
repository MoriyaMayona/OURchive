# 测试账号个人作品导入说明

## 图片放置位置

测试账号“我”的个人作品图片统一放在：

```text
public/demo-uploads/my-projects/
```

Windows 本地路径：

```text
D:\OURchive\my-app\public\demo-uploads\my-projects\
```

## 支持格式

当前生成脚本会收集以下图片格式：

- `png`
- `jpg`
- `jpeg`
- `webp`
- `gif`

## 新增图片后的操作

新增、删除或替换图片后，运行：

```bash
npm run generate:my-projects
npm run dev
```

`npm run dev` 不会自动扫描图片目录，避免拖慢启动。需要手动运行生成命令更新作品列表。

## 网站访问路径

`public` 目录下的图片在网站中不要写 `/public`。

正确路径示例：

```text
/demo-uploads/my-projects/文件名.png
```

## 图片会出现在哪里

生成后的作品会出现在：

- `/works` 作品墙
- `/space/admin` 我的QQ空间

作品墙展示顺序：

1. 当前会话上传作品
2. 灵梦生日活动作品
3. 我的个人作品导入
4. 其他默认作品

其中，我的个人作品导入路径是：

```text
public/demo-uploads/my-projects/
```

灵梦生日活动作品路径是：

```text
public/works/reimu-birthday/
```

## 修改标题、标签或描述

如果想改自动生成的作品标题、标签、描述、点赞数或评论内容，修改：

```text
lib/myProjectsManifest.ts
```

注意：再次运行 `npm run generate:my-projects` 会重新生成该文件，并覆盖手动修改。

## 注意事项

- public 下的图片引用路径不要写 `/public`。
- 正确路径是 `/demo-uploads/my-projects/xxx.png`。
- 文件名会自动去掉扩展名，并把 `-` 和 `_` 替换为空格，再加上书名号。
- 文件名尽量不要有特殊符号。
- 图片太大可能影响网页性能，建议压缩到 1-2MB 以内。
