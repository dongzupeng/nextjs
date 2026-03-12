import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-lg bg-card p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* 封面图片 */}
        {post.coverImage && (
          <div className="mb-4 rounded-lg overflow-hidden shadow-md aspect-video relative">
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">{post.author.username}</span>
          <span>•</span>
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
        {/* 统计信息 */}
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            ❤️ {post.likeCount || 0}
          </span>
          <span className="flex items-center gap-1">
            ⭐ {post.bookmarkCount || 0}
          </span>
          {post.views !== undefined && (
            <span className="flex items-center gap-1">
              👁️ {post.views}
            </span>
          )}
        </div>
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
