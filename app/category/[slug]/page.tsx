import { notFound } from 'next/navigation';
import { getCategoryBySlug, getPostsByCategory } from '@/data/posts';
import PostListItem from '@/components/blog/PostListItem';

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  const posts = getPostsByCategory(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">分类: {category.name}</h1>
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>该分类下暂无文章</p>
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
