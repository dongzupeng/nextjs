import { siteConfig } from '@/lib/config';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">关于我</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            你好！我是 {siteConfig.author.name}，一名前端开发工程师。
          </p>
          <p>
            欢迎来到我的个人博客。这里我会分享关于前端开发、Next.js、React 以及其他技术相关的内容。
          </p>
          <p>
            如果你想联系我，可以通过邮箱: {siteConfig.author.email}
          </p>
        </div>
      </article>
    </div>
  );
}
