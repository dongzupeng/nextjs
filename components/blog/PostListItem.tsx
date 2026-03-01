import Link from 'next/link';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <article className="rounded-lg bg-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]">
      <Link href={`/blog/${post.slug}`} className="group">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.category.name}</span>
          <span>•</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}
