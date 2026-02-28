/**
 * 数据库初始化脚本 - 使用Prisma
 * 运行方式: npx ts-node scripts/init-db.ts
 */
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    console.log('开始初始化数据库...\n');

    // 1. 创建默认分类
    console.log('1. 创建默认分类...');
    const defaultCategory = await prisma.category.upsert({
      where: { slug: 'uncategorized' },
      update: {},
      create: {
        name: '未分类',
        slug: 'uncategorized',
        description: '默认分类',
      },
    });
    console.log('✓ 默认分类创建成功:', defaultCategory.name);

    // 2. 创建示例分类
    console.log('\n2. 创建示例分类...');
    const categories = [
      { name: '技术', slug: 'tech', description: '技术文章' },
      { name: '生活', slug: 'life', description: '生活随笔' },
      { name: '随笔', slug: 'notes', description: '个人笔记' },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
      console.log(`  - ${category.name}`);
    }
    console.log('✓ 示例分类创建成功');

    // 3. 创建示例标签
    console.log('\n3. 创建示例标签...');
    const tags = [
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'React', slug: 'react' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Tailwind CSS', slug: 'tailwind' },
      { name: 'Prisma', slug: 'prisma' },
    ];

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      });
      console.log(`  - ${tag.name}`);
    }
    console.log('✓ 示例标签创建成功');

    // 4. 创建示例用户
    console.log('\n4. 创建示例用户...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await prisma.user.upsert({
      where: { username: 'demo' },
      update: {},
      create: {
        username: 'demo',
        email: 'demo@example.com',
        password: hashedPassword,
      },
    });
    console.log('✓ 示例用户创建成功:', demoUser.username);
    console.log('  登录信息: 用户名: demo, 密码: password123');

    // 5. 创建示例文章
    console.log('\n5. 创建示例文章...');
    const samplePost = await prisma.post.upsert({
      where: { slug: 'welcome-to-my-blog' },
      update: {},
      create: {
        title: '欢迎来到我的博客',
        slug: 'welcome-to-my-blog',
        excerpt: '这是我的第一篇博客文章，使用Next.js和Prisma构建。',
        content: `# 欢迎来到我的博客

这是我的第一篇博客文章！

## 技术栈

这个博客使用了以下技术：

- **Next.js** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Prisma** - ORM框架
- **MySQL** - 数据库

## 功能特性

- 响应式设计
- 深色/浅色主题切换
- 文章管理
- 用户认证
- 分类和标签

感谢访问！`,
        coverImage: '/images/default-cover.jpg',
        readingTime: 2,
        authorId: demoUser.id,
        categoryId: defaultCategory.id,
      },
    });

    // 为文章添加标签
    const nextjsTag = await prisma.tag.findUnique({ where: { slug: 'nextjs' } });
    const reactTag = await prisma.tag.findUnique({ where: { slug: 'react' } });
    const prismaTag = await prisma.tag.findUnique({ where: { slug: 'prisma' } });

    if (nextjsTag && reactTag && prismaTag) {
      // 清除现有标签关联
      await prisma.postTag.deleteMany({
        where: { postId: samplePost.id },
      });

      // 添加新标签关联
      await prisma.postTag.createMany({
        data: [
          { postId: samplePost.id, tagId: nextjsTag.id },
          { postId: samplePost.id, tagId: reactTag.id },
          { postId: samplePost.id, tagId: prismaTag.id },
        ],
      });
    }

    console.log('✓ 示例文章创建成功:', samplePost.title);

    console.log('\n========================================');
    console.log('数据库初始化完成！');
    console.log('========================================');
    console.log('\n你可以使用以下账号登录:');
    console.log('  用户名: demo');
    console.log('  密码: password123');
    console.log('\n或者注册新账号。');

  } catch (error) {
    console.error('初始化数据库时出错:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
