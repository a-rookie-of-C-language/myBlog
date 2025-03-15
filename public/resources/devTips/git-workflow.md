# Git 工作流最佳实践

## 引言

在团队协作开发中，一个良好的 Git 工作流程对于提高开发效率、减少冲突和保持代码质量至关重要。本文将介绍几种常见的 Git 工作流模型，并提供一些实用的技巧。

## Git Flow 工作流

Git Flow 是最早被广泛采用的 Git 工作流模型之一，它定义了一套严格的分支管理规范。

### 主要分支

- **master**: 存放正式发布的版本
- **develop**: 日常开发分支，包含最新的开发特性

### 辅助分支

- **feature/xxx**: 新功能开发分支，从 develop 分支创建，完成后合并回 develop
- **release/xxx**: 版本发布分支，从 develop 分支创建，完成后合并到 master 和 develop
- **hotfix/xxx**: 紧急修复分支，从 master 分支创建，完成后合并到 master 和 develop

### 工作流程

```
(master) ---------|-------------------|--------------------
                   \                 /
                    \               /
(develop) ------|-----\-------------/-----|----------------
                 \     \           /     /
                  \     \         /     /
(feature)          \     \       /     /
                    \     \     /     /
(release)            -----\---/-----
                            \ /
(hotfix)                     X
```

## GitHub Flow 工作流

GitHub Flow 是一个更加简化的工作流程，特别适合持续部署的项目。

### 主要特点

1. 只有一个长期分支 master，保持随时可部署
2. 新功能通过创建新分支开发，分支名应该描述性强
3. 提交到远程仓库，并创建 Pull Request
4. 代码评审后合并到 master 分支
5. 合并后立即部署

## 实用技巧

### 提交信息规范

良好的提交信息格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**: feat(新功能), fix(修复), docs(文档), style(格式), refactor(重构), test(测试), chore(构建/工具)
- **scope**: 影响范围
- **subject**: 简短描述
- **body**: 详细描述
- **footer**: 关闭 issue 等信息

### 常用命令

```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 将当前修改添加到暂存区
git add .

# 提交修改
git commit -m "feat: add new feature"

# 推送到远程仓库
git push origin feature/new-feature

# 合并分支
git checkout develop
git merge feature/new-feature
```

## 结论

选择适合团队的 Git 工作流非常重要，它应该足够简单以便团队成员理解和遵循，同时又能满足项目的需求。无论选择哪种工作流，保持良好的提交习惯和分支管理都是提高团队协作效率的关键。