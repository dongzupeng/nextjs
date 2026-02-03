import Link from 'next/link';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.category.name}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mb-4 text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
