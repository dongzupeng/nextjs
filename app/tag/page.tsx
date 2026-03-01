/**
 * 标签列表页面
 * 使用 API 获取数据
 */
'use client';

import { useState, useEffect } from 'react';
import { Tag } from '@/types/blog';

export default function TagPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 加载标签列表
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => {
        setTags(data.tags || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('加载标签失败:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">标签</h1>
      {isLoading ? (
        <div className="text-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>暂无标签</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <a
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-card px-4 py-2 text-sm shadow-sm transition-all hover:bg-accent hover:shadow-md"
            >
              {tag.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
