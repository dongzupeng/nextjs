/**
 * 新建文章页面
 * 使用API提交数据
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    selectedTags: [] as number[],
  });

  // 初始化数据
  useEffect(() => {
    loadCategories();
    loadTags();
    loadUserInfo();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUserId(data.user.id);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.content || !formData.categoryId || !userId) {
      setError('请填写必填字段');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          categoryId: parseInt(formData.categoryId),
          tags: formData.selectedTags,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建文章失败');
      }

      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理标签选择
  const handleTagChange = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">新建文章</h1>
        <Link
          href="/admin/posts"
          className="rounded-lg border px-4 py-2 transition-colors hover:bg-accent"
        >
          返回列表
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            文章标题 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="请输入文章标题"
            required
          />
        </div>

        {/* 摘要 */}
        <div>
          <label className="mb-2 block text-sm font-medium">文章摘要</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="请输入文章摘要（可选，不填写将自动提取正文前200字）"
          />
        </div>

        {/* 分类 */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            文章分类 <span className="text-destructive">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">请选择分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 标签 */}
        <div>
          <label className="mb-2 block text-sm font-medium">文章标签</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
                  formData.selectedTags.includes(tag.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={formData.selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="sr-only"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        {/* 内容 */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            文章内容 <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full rounded-lg border bg-background px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            rows={20}
            placeholder="请输入文章内容，支持 Markdown 格式"
            required
          />
        </div>

        {/* 预览 */}
        {formData.content && (
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">预览</h3>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{formData.content.slice(0, 500)}...</pre>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? '发布中...' : '发布文章'}
          </button>
          <Link
            href="/admin/posts"
            className="rounded-lg border px-6 py-2 transition-colors hover:bg-accent"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
