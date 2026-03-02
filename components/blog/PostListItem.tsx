import Link from 'next/link';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <article className="mb-8 rounded-lg bg-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]">
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">{post.author.username}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.category.name}</span>
          <span>•</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mb-4 text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
        {/* 标签在底部 */}
        <div className="mt-auto flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground shadow-sm"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
