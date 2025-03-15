# 静态部署指南

本项目已经适配了GitHub Pages等静态托管环境，可以按照以下步骤进行部署。

## 部署步骤

1. **生成静态JSON文件**

   运行以下命令生成静态JSON文件，这些文件将模拟后端API响应：

   ```bash
   npm run generate-static
   ```

2. **构建前端项目**

   运行以下命令构建前端项目：

   ```bash
   npm run build
   ```

   或者使用预部署命令一次完成上述两个步骤：

   ```bash
   npm run predeploy
   ```

3. **部署到GitHub Pages**

   将`dist`目录中的内容推送到GitHub仓库的`gh-pages`分支，或者使用GitHub Actions自动部署。

## 工作原理

本项目使用静态JSON文件模拟后端API响应，前端代码已经适配为使用这些静态文件。主要修改包括：

1. 前端API请求路径已更新为相对路径，适配GitHub Pages环境
2. 使用`generate-static-files.js`脚本生成所有必要的静态JSON文件
3. 这些静态文件位于`public/myBlog/contents/`目录下，包括：
   - `category/`: 存放分类列表的JSON文件
   - `item/`: 存放内容项详情的JSON文件
   - `file/`: 存放内容文件的JSON文件

## 注意事项

- 每次添加或修改内容后，需要重新运行`npm run generate-static`生成最新的静态文件
- 在本地开发时，可以继续使用`npm run serve`命令，它会使用本地的Express服务器
- 部署到生产环境时，确保`vue.config.js`中的`publicPath`设置正确，默认为`/myBlog/`