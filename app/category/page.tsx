/**
 * 分类列表页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/blog';

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载分类列表
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('加载分类失败:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">分类</h1>
      {isLoading ? (
        <div className="text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>暂无分类</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="rounded-lg bg-card p-6 shadow-md transition-all hover:bg-accent hover:shadow-lg"
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
