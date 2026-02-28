# Next.js 个人博客系统

一个功能完整的个人博客系统，使用 Next.js 16、MySQL、TypeScript 和 Tailwind CSS 构建。

## 功能特性

- ✅ 用户注册和登录
- ✅ JWT 身份验证
- ✅ 文章管理（增删改查）
- ✅ 分类和标签系统
- ✅ 主题切换（浅色/深色/系统）
- ✅ 响应式设计
- ✅ MySQL 数据库存储
- ✅ RESTful API

## 技术栈

- **前端框架**: Next.js 16.1.6 (App Router)
- **UI 库**: Tailwind CSS 4
- **数据库**: MySQL
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **语言**: TypeScript

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并配置数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db

JWT_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 创建 MySQL 数据库

确保 MySQL 服务已启动，然后运行初始化脚本：

```bash
npm run init-db
```

这将自动创建数据库、表结构和初始数据。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 数据库结构

### 用户表 (users)
- id: 用户ID
- username: 用户名
- email: 邮箱
- password: 密码（加密）
- created_at: 创建时间
- updated_at: 更新时间

### 分类表 (categories)
- id: 分类ID
- name: 分类名称
- slug: 分类别名
- description: 分类描述

### 标签表 (tags)
- id: 标签ID
- name: 标签名称
- slug: 标签别名

### 文章表 (posts)
- id: 文章ID
- title: 文章标题
- slug: 文章别名
- excerpt: 文章摘要
- content: 文章内容
- cover_image: 封面图片
- author_id: 作者ID（外键）
- category_id: 分类ID（外键）
- published_at: 发布时间
- updated_at: 更新时间
- reading_time: 阅读时间
- views: 浏览量

### 文章标签关联表 (post_tags)
- post_id: 文章ID（外键）
- tag_id: 标签ID（外键）

## API 接口

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 用户登出

### 文章接口

- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:id` - 获取单个文章
- `POST /api/posts` - 创建文章（需要登录）
- `PUT /api/posts/:id` - 更新文章（需要登录）
- `DELETE /api/posts/:id` - 删除文章（需要登录）

### 分类接口

- `GET /api/categories` - 获取所有分类

### 标签接口

- `GET /api/tags` - 获取所有标签

## 页面路由

### 公开页面
- `/` - 首页
- `/blog` - 博客列表
- `/blog/:slug` - 文章详情
- `/category` - 分类列表
- `/category/:slug` - 分类详情
- `/tag` - 标签列表
- `/tag/:slug` - 标签详情
- `/about` - 关于页面

### 认证页面
- `/login` - 登录页面
- `/register` - 注册页面

### 后台管理（需要登录）
- `/admin` - 后台首页
- `/admin/posts` - 文章管理
- `/admin/posts/new` - 新建文章
- `/admin/posts/edit/:id` - 编辑文章

## 使用说明

### 1. 注册账户

访问 `/register` 页面，填写用户名、邮箱和密码进行注册。

### 2. 登录系统

访问 `/login` 页面，使用用户名或邮箱登录。

### 3. 创建文章

登录后，访问 `/admin/posts/new` 创建新文章。

### 4. 管理文章

在 `/admin/posts` 页面可以查看、编辑和删除文章。

### 5. 切换主题

点击页面右上角的主题切换按钮，在浅色、深色和系统主题之间切换。

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行代码检查
npm run init-db  # 初始化数据库
```

## 注意事项

1. **生产环境部署**：
   - 修改 `JWT_SECRET` 为强密码
   - 使用 HTTPS
   - 配置正确的数据库连接信息
   - 设置适当的 CORS 策略

2. **数据库安全**：
   - 不要在代码中硬编码数据库密码
   - 使用环境变量存储敏感信息
   - 定期备份数据库

3. **性能优化**：
   - 添加图片优化
   - 实现分页功能
   - 添加缓存机制

## 许可证

MIT License
