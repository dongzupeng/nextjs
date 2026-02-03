import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/data/posts';
import { formatDate } from '@/lib/utils';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{post.author.name}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <div className="prose prose-lg max-w-none">
          <p>{post.content}</p>
        </div>
      </article>
    </div>
  );
}
