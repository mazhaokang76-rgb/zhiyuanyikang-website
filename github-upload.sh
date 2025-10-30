#!/bin/bash

# 智缘益慷网站 - GitHub部署脚本
# 使用方法: ./github-upload.sh your-repo-url

echo "🚀 智缘益慷网站 - GitHub部署脚本"
echo "================================"

# 检查是否提供了仓库URL
if [ $# -eq 0 ]; then
    echo "❌ 错误: 请提供GitHub仓库URL"
    echo "使用方法: $0 <GitHub仓库URL>"
    echo "例如: $0 https://github.com/mazhaokang76-rgb/zhiyuan-yikang-website.git"
    exit 1
fi

REPO_URL=$1
PROJECT_NAME="zhiyuan-yikang-website"

echo "📦 项目名称: $PROJECT_NAME"
echo "📡 仓库地址: $REPO_URL"
echo ""

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误: Git未安装，请先安装Git"
    echo "下载地址: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git已安装"

# 初始化git仓库
if [ ! -d ".git" ]; then
    echo "🔧 初始化Git仓库..."
    git init
else
    echo "✅ Git仓库已存在"
fi

# 创建.gitignore文件
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build outputs
dist/
build/
.vite-temp/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
EOF

echo "✅ .gitignore文件已创建"

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到package.json文件"
    echo "请确保您在正确的项目目录中"
    exit 1
fi

echo "✅ package.json文件存在"

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin $REPO_URL || echo "⚠️  远程仓库可能已存在"

# 检查是否有现有提交
if ! git rev-parse HEAD &> /dev/null; then
    echo "📝 创建初始提交..."
    git add .
    git commit -m "初始提交: 智缘益慷企业官网

功能特性:
- 🏥 企业介绍和团队展示
- 💡 AI康复技术解决方案
- 📊 成功案例展示
- 📚 专家共识文档下载
- 📞 在线咨询和联系表单
- 📱 响应式设计，支持移动端

技术栈:
- React 18 + TypeScript
- Vite构建工具
- Tailwind CSS + shadcn/ui
- Supabase后端服务"
else
    echo "✅ 已存在提交"
    git add .
    git commit -m "更新: 智缘益慷企业官网"
fi

# 检查分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 切换到main分支..."
    git branch -M main
fi

echo ""
echo "🎯 准备推送到GitHub..."
echo ""
echo "接下来的步骤:"
echo "1. 确认仓库URL: $REPO_URL"
echo "2. 如果需要认证，请确保您的Git凭据已正确配置"
echo "3. 运行以下命令推送到GitHub:"
echo ""
echo "   git push -u origin main"
echo ""
echo "或者运行以下命令（如果需要输入用户名和密码）:"
echo "   git push origin main"
echo ""

read -p "🤔 您现在想要推送到GitHub吗? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 推送到GitHub..."
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 部署成功！"
        echo ""
        echo "接下来的部署选项:"
        echo ""
        echo "1. Vercel部署 (推荐):"
        echo "   - 访问: https://vercel.com"
        echo "   - 连接您的GitHub仓库"
        echo "   - 自动部署，获得访问链接"
        echo ""
        echo "2. Netlify部署:"
        echo "   - 访问: https://netlify.com"
        echo "   - 选择 'Deploy to Netlify'"
        echo "   - 连接GitHub仓库"
        echo ""
        echo "3. GitHub Pages:"
        echo "   - 在仓库设置中启用Pages"
        echo "   - 选择GitHub Actions"
        echo "   - 自动部署到 https://mazhaokang76-rgb.github.io/$PROJECT_NAME/"
        echo ""
    else
        echo "❌ 推送失败，请检查:"
        echo "1. 仓库权限是否正确"
        echo "2. Git凭据是否配置"
        echo "3. 网络连接是否正常"
    fi
else
    echo "✅ 已准备好代码，您可以手动运行: git push -u origin main"
fi

echo ""
echo "📖 详细部署指南请查看: 部署指南.md"