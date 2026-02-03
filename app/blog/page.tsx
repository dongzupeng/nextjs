import PostCard from '@/components/blog/PostCard';
import { posts } from '@/data/posts';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">博客</h1>
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>暂无文章</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
