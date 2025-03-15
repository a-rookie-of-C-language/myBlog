# 部署指南

## GitHub Pages 部署

本项目已配置为可以轻松部署到 GitHub Pages。以下是部署步骤：

### 自动部署（推荐）

1. 将代码推送到 GitHub 仓库的 `main` 分支
2. GitHub Actions 将自动构建项目并部署到 `gh-pages` 分支
3. 访问 `https://<你的用户名>.github.io/myBlog` 查看部署的网站

### 手动部署

如果你想手动部署，可以按照以下步骤操作：

1. 构建项目
   ```bash
   npm run build
   ```

2. 将 `dist` 目录的内容推送到 GitHub 仓库的 `gh-pages` 分支

## 后端服务部署

注意：GitHub Pages 只能托管静态文件，不能运行后端服务。你需要将后端服务部署到支持 Node.js 的平台上，如 Vercel、Netlify、Heroku 等。

部署后端服务后，请更新 `src/utils/request.ts` 文件中的 API 地址：

```typescript
baseURL: process.env.NODE_ENV === 'production' 
  ? 'https://你的后端服务地址' // 替换为你的后端服务地址
  : 'http://localhost:3000',
```

## 本地开发

1. 启动前端服务
   ```bash
   npm run serve
   ```

2. 启动后端服务
   ```bash
   node server.js
   ```