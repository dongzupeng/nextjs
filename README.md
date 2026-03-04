# FishpondBlog - 鱼塘博客系统

一个功能完整的个人博客系统，使用 Next.js 16、MySQL、TypeScript 和 Tailwind CSS 构建。

## 项目简介

FishpondBlog（鱼塘博客）是一个专为个人用户设计的博客系统，允许用户注册、登录、发布文章、管理分类和标签。系统采用现代化的技术栈，具有响应式设计，支持主题切换，适合作为个人网站或学习 Next.js 的示例项目。

## 功能特性

- ✅ 用户注册和登录
- ✅ JWT 身份验证
- ✅ 文章管理（增删改查）
- ✅ 分类和标签系统
- ✅ 主题切换（浅色/深色/系统）
- ✅ 响应式设计
- ✅ MySQL 数据库存储
- ✅ RESTful API
- ✅ Markdown 支持
- ✅ 权限控制

## 技术栈详解

### 前端技术
- **前端框架**: Next.js 16.1.6 (App Router) - 基于 React 的全栈框架，支持服务端渲染和静态生成
- **UI 库**: Tailwind CSS 4 - 实用优先的 CSS 框架，通过类名快速构建响应式界面
- **语言**: TypeScript - 类型安全的 JavaScript 超集，提高代码可维护性
- **Markdown 支持**: react-markdown + remark-gfm + rehype-highlight - 实现 Markdown 渲染和代码高亮

### 后端技术
- **数据库**: MySQL - 关系型数据库，用于存储用户、文章、分类和标签数据
- **ORM**: Prisma 6.19.2 - 现代化的数据库 ORM，提供类型安全的数据库访问
- **认证**: JWT (jsonwebtoken) - 无状态的身份验证机制
- **密码加密**: bcryptjs - 安全的密码哈希库

## 核心概念说明

### Next.js App Router

Next.js 16 使用 App Router 架构，将应用分为服务器组件和客户端组件：

- **服务器组件** (默认): 运行在服务器端，适合处理数据获取、SEO 优化
- **客户端组件**: 运行在浏览器端，使用 `'use client'` 标记，适合处理用户交互

### Prisma ORM 工作原理

Prisma 是一个现代化的 ORM（对象关系映射）工具，它的工作流程如下：

1. **Schema 定义**: 在 `prisma/schema.prisma` 文件中定义数据模型
2. **数据库迁移**: 通过 `npx prisma migrate` 命令将 schema 转换为数据库表结构
3. **客户端生成**: Prisma 自动生成类型安全的客户端代码
4. **数据库操作**: 使用生成的 Prisma Client 执行数据库操作

### MySQL 与 Prisma 的关联

1. **连接配置**: 通过环境变量 `DATABASE_URL` 配置 MySQL 连接
2. **数据模型映射**: Prisma schema 中的模型对应 MySQL 中的表
3. **关系定义**: 在 schema 中定义模型之间的关系（如用户与文章的一对多关系）
4. **自动生成 SQL**: Prisma 会根据你的操作自动生成优化的 SQL 查询

## 项目结构

```
nextjs/
├── app/                    # App Router 目录
│   ├── api/                # API 路由
│   │   ├── auth/           # 认证相关 API
│   │   ├── posts/          # 文章相关 API
│   │   ├── categories/     # 分类相关 API
│   │   └── tags/           # 标签相关 API
│   ├── admin/              # 后台管理页面
│   │   ├── posts/          # 文章管理
│   │   ├── categories/     # 分类管理
│   │   └── tags/           # 标签管理
│   ├── login/              # 登录页面
│   ├── register/           # 注册页面
│   ├── blog/               # 博客页面
│   ├── category/           # 分类页面
│   ├── tag/                # 标签页面
│   ├── about/              # 关于页面
│   ├── favicon.ico         # 网站图标
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # 可复用组件
│   ├── Header.tsx          # 头部组件
│   ├── Footer.tsx          # 底部组件
│   ├── PostCard.tsx        # 文章卡片
│   └── ThemeToggle.tsx     # 主题切换组件
├── lib/                    # 工具库
│   ├── prisma.ts           # Prisma Client 实例
│   ├── auth.ts             # 认证相关函数
│   └── config.ts           # 配置文件
├── prisma/                 # Prisma 相关文件
│   ├── schema.prisma       # 数据库模型定义
│   └── prisma.config.ts    # Prisma 配置
├── scripts/                # 脚本文件
│   ├── dev.js              # 开发服务器启动脚本
│   └── init-db.ts          # 数据库初始化脚本
├── .env.local              # 环境变量
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 安装步骤详解

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并配置数据库连接信息：

```env
# 数据库连接信息
DATABASE_URL="mysql://root:your_password@localhost:3306/blog_db"

# JWT 密钥
JWT_SECRET=your-secret-key-change-this-in-production

# 网站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**说明**：
- `DATABASE_URL` 格式：`mysql://用户名:密码@主机:端口/数据库名`
- `JWT_SECRET` 用于生成和验证 JWT 令牌，生产环境应使用强随机字符串

### 3. 安装 MySQL

如果还没有安装 MySQL，可以按照以下步骤安装：

#### Windows 用户
1. 下载 MySQL Installer 从 [MySQL 官网](https://dev.mysql.com/downloads/installer/)
2. 运行安装程序，选择 "Developer Default" 配置
3. 设置 root 密码
4. 启动 MySQL 服务

#### macOS 用户
1. 使用 Homebrew 安装：`brew install mysql`
2. 启动 MySQL 服务：`brew services start mysql`
3. 运行安全设置：`mysql_secure_installation`

#### Linux 用户
1. Ubuntu/Debian: `sudo apt install mysql-server`
2. CentOS/RHEL: `sudo yum install mysql-server`
3. 启动服务：`sudo systemctl start mysql`
4. 运行安全设置：`sudo mysql_secure_installation`

### 4. 初始化数据库

运行初始化脚本：

```bash
npm run init-db
```

**脚本功能**：
1. 检查并创建数据库（如果不存在）
2. 运行 Prisma 迁移，创建表结构
3. 生成 Prisma Client
4. 插入初始数据（默认分类和标签）

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 数据库结构详解

### 数据模型关系

```
User (用户) ──┐
              │ 一对多
              ▼
Post (文章) ──┼─┐
              │ │
              │ │ 多对多
              ▼ ▼
Category (分类)  Tag (标签)
```

### 详细表结构

#### 用户表 (users)
- `id`: 用户ID (自增主键)
- `username`: 用户名 (唯一)
- `email`: 邮箱 (唯一)
- `password`: 密码（bcrypt 加密）
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 分类表 (categories)
- `id`: 分类ID (自增主键)
- `name`: 分类名称
- `slug`: 分类别名 (唯一，用于URL)
- `description`: 分类描述
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 标签表 (tags)
- `id`: 标签ID (自增主键)
- `name`: 标签名称
- `slug`: 标签别名 (唯一，用于URL)
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 文章表 (posts)
- `id`: 文章ID (自增主键)
- `title`: 文章标题
- `slug`: 文章别名 (唯一，用于URL)
- `excerpt`: 文章摘要
- `content`: 文章内容 (支持Markdown)
- `cover_image`: 封面图片
- `author_id`: 作者ID（外键，关联users表）
- `category_id`: 分类ID（外键，关联categories表）
- `published_at`: 发布时间
- `updated_at`: 更新时间
- `reading_time`: 阅读时间
- `views`: 浏览量

#### 文章标签关联表 (post_tags)
- `post_id`: 文章ID（外键，关联posts表）
- `tag_id`: 标签ID（外键，关联tags表）
- **复合主键**: (post_id, tag_id)

## API 接口详解

### 认证接口

- `POST /api/auth/register` - 用户注册
  - 请求体: `{ "username": "...", "email": "...", "password": "..." }`
  - 响应: `{ "user": {...}, "token": "..." }`

- `POST /api/auth/login` - 用户登录
  - 请求体: `{ "email": "...", "password": "..." }`
  - 响应: `{ "user": {...}, "token": "..." }`

- `GET /api/auth/me` - 获取当前用户信息
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "user": {...} }`

- `POST /api/auth/logout` - 用户登出
  - 响应: `{ "message": "登出成功" }`

### 文章接口

- `GET /api/posts` - 获取文章列表
  - 查询参数: `page`, `limit`, `category`, `tag`
  - 响应: `{ "posts": [...], "total": 100 }`

- `GET /api/posts/:id` - 获取单个文章
  - 响应: `{ "post": {...}, "author": {...}, "category": {...}, "tags": [...] }`

- `POST /api/posts` - 创建文章（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ "title": "...", "content": "...", "category_id": 1, "tagIds": [1, 2, 3] }`
  - 响应: `{ "post": {...} }`

- `PUT /api/posts/:id` - 更新文章（需要登录且只能更新自己的文章）
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ "title": "...", "content": "...", "category_id": 1, "tagIds": [1, 2, 3] }`
  - 响应: `{ "post": {...} }`

- `DELETE /api/posts/:id` - 删除文章（需要登录且只能删除自己的文章）
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "message": "删除成功" }`

### 分类接口

- `GET /api/categories` - 获取所有分类
  - 响应: `{ "categories": [...] }`

- `POST /api/categories` - 创建分类（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ "name": "...", "slug": "...", "description": "..." }`
  - 响应: `{ "category": {...} }`

- `PUT /api/categories/:id` - 更新分类（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ "name": "...", "slug": "...", "description": "..." }`
  - 响应: `{ "category": {...} }`

- `DELETE /api/categories/:id` - 删除分类（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "message": "删除成功" }`

### 标签接口

- `GET /api/tags` - 获取所有标签
  - 响应: `{ "tags": [...] }`

- `POST /api/tags` - 创建标签（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ "name": "...", "slug": "..." }`
  - 响应: `{ "tag": {...} }`

- `PUT /api/tags/:id` - 更新标签（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 请求体: `{ "name": "...", "slug": "..." }`
  - 响应: `{ "tag": {...} }`

- `DELETE /api/tags/:id` - 删除标签（需要登录）
  - 请求头: `Authorization: Bearer <token>`
  - 响应: `{ "message": "删除成功" }`

## 页面路由详解

### 公开页面
- `/` - 首页 - 显示最新文章
- `/blog` - 博客列表 - 分页显示所有文章
- `/blog/:slug` - 文章详情 - 显示单篇文章内容
- `/category` - 分类列表 - 显示所有分类
- `/category/:slug` - 分类详情 - 显示指定分类下的文章
- `/tag` - 标签列表 - 显示所有标签
- `/tag/:slug` - 标签详情 - 显示指定标签下的文章
- `/about` - 关于页面 - 显示网站信息

### 认证页面
- `/login` - 登录页面 - 用户登录表单
- `/register` - 注册页面 - 用户注册表单

### 后台管理（需要登录）
- `/admin` - 后台首页 - 管理概览
- `/admin/posts` - 文章管理 - 文章列表和操作
- `/admin/posts/new` - 新建文章 - 创建新文章表单
- `/admin/posts/edit/:id` - 编辑文章 - 编辑现有文章
- `/admin/categories` - 分类管理 - 分类列表和操作
- `/admin/tags` - 标签管理 - 标签列表和操作

## 开发指南

### 1. 数据库操作

使用 Prisma Client 进行数据库操作：

```typescript
// 示例：获取所有文章
import prisma from '@/lib/prisma';

const posts = await prisma.post.findMany({
  include: {
    author: true,
    category: true,
    tags: true
  }
});
```

### 2. 添加新功能

#### 步骤 1: 更新数据模型
修改 `prisma/schema.prisma` 文件，添加新的模型或字段。

#### 步骤 2: 运行迁移
```bash
npx prisma migrate dev --name add-new-feature
```

#### 步骤 3: 生成客户端
```bash
npx prisma generate
```

#### 步骤 4: 实现 API 接口
在 `app/api/` 目录下创建新的 API 路由。

#### 步骤 5: 创建前端页面
在 `app/` 目录下创建新的页面组件。

### 3. 调试技巧

- **查看数据库状态**: `npx prisma studio` - 打开 Prisma Studio 可视化管理数据库
- **查看生成的 SQL**: `npx prisma db pull` - 从数据库拉取结构
- **检查 Prisma Client**: `npx prisma generate` - 重新生成客户端

## 部署指南

### 部署到 Vercel

1. **创建 Vercel 账户** - 访问 [Vercel](https://vercel.com/) 注册账户

2. **导入项目** - 通过 GitHub 导入你的项目

3. **配置环境变量** - 在 Vercel 项目设置中添加：
   - `DATABASE_URL`: 你的数据库连接字符串
   - `JWT_SECRET`: 强随机字符串
   - `NEXT_PUBLIC_SITE_URL`: 你的网站 URL

4. **数据库配置** - 你需要：
   - 使用外部 MySQL 服务（如 PlanetScale、Railway 或 AWS RDS）
   - 确保数据库允许外部连接
   - 运行数据库初始化脚本

5. **部署** - 点击 "Deploy" 按钮，Vercel 会自动构建和部署你的应用

### 数据库服务推荐

- **PlanetScale**: 专为 Next.js 优化的 MySQL 服务
- **Railway**: 简单易用的数据库托管服务
- **AWS RDS**: 可靠的云数据库服务
- **DigitalOcean Managed Databases**: 性价比高的数据库服务

## 常见问题解答

### 1. 数据库连接失败

**解决方案**：
- 检查 MySQL 服务是否运行
- 验证 `DATABASE_URL` 配置是否正确
- 确保数据库用户有正确的权限
- 检查防火墙是否允许连接

### 2. 登录后无法访问后台

**解决方案**：
- 检查 JWT 令牌是否正确生成
- 验证 `JWT_SECRET` 是否配置
- 检查浏览器是否支持 cookies
- 查看控制台是否有错误信息

### 3. 文章保存失败

**解决方案**：
- 检查表单字段是否填写完整
- 验证分类和标签是否存在
- 查看控制台网络请求是否有错误
- 检查数据库权限

### 4. 主题切换不生效

**解决方案**：
- 检查浏览器是否支持 localStorage
- 查看控制台是否有 JavaScript 错误
- 确保主题切换组件正确导入

## 学习资源

### Next.js 学习
- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js 基础教程](https://nextjs.org/learn)

### Prisma 学习
- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma 入门教程](https://www.prisma.io/blog/getting-started-with-prisma-2-0-8t3w27xkrxx5)

### MySQL 学习
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [MySQL 入门教程](https://www.mysqltutorial.org/)

### TypeScript 学习
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript 入门教程](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

## 许可证

MIT License