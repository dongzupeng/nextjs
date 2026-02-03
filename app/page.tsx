import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { posts } from '@/data/posts';
import PostCard from '@/components/blog/PostCard';

export default function Home() {
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          欢迎来到 {siteConfig.name}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/blog"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            浏览博客
          </Link>
          <Link
            href="/about"
            className="rounded-lg border px-6 py-3 transition-colors hover:bg-accent"
          >
            关于我
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl">
        <h2 className="mb-8 text-2xl font-bold">最新文章</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
