import { tags } from '@/data/posts';

export default function TagPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">标签</h1>
      {tags.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>暂无标签</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <a
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              {tag.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
