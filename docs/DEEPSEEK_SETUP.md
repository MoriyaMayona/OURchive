# DeepSeek 接入说明

## 1. 创建 .env.local

在项目根目录创建 `.env.local` 文件，也就是和 `package.json` 同级的位置：

```env
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
```

## 2. 注意事项

- 不要把 `.env.local` 上传到 GitHub。
- 不要把 API Key 写进 `page.tsx`。
- 不要把 API Key 发给前端。
- 修改 `.env.local` 后必须重启 `npm run dev`。

## 3. 启动步骤

```bash
npm install
npm run dev
```

## 4. 测试步骤

打开：

```text
http://localhost:3000/promo
```

点击：

```text
重新生成 AI 文案
```

## 5. 常见问题

- `Missing DEEPSEEK_API_KEY`：说明 `.env.local` 没配置或配置后没有重启开发服务器。
- `401`：Key 错误或无权限。
- 网络错误：检查网络、代理或 API 服务状态。
- JSON解析失败：页面会使用 fallback 文案。
