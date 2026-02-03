import { categories } from '@/data/posts';

export default function CategoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">分类</h1>
      {categories.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>暂无分类</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
            >
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 text-muted-foreground">
                {category.description}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
