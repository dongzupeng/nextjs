import { notFound } from 'next/navigation';
import { getTagBySlug, getPostsByTag } from '@/data/posts';
import PostListItem from '@/components/blog/PostListItem';

export default function TagDetailPage({ params }: { params: { slug: string } }) {
  const tag = getTagBySlug(params.slug);
  const posts = getPostsByTag(params.slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">标签: {tag.name}</h1>
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>该标签下暂无文章</p>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
