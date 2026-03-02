/**
 * 编辑文章页面
 * 使用API提交数据
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState('');
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    selectedTags: [] as number[],
  });

  // 加载文章数据
  useEffect(() => {
    loadPostData();
    loadCategories();
    loadTags();
  }, [postId]);

  const loadPostData = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error('文章不存在');
      }
      const data = await response.json();
      
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.category?.id?.toString() || '',
        selectedTags: data.tags?.map((tag: any) => tag.id) || [],
      });
      
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

  // 处理标签选择
  const handleTagChange = (tagId: number) => {
    if (formData.selectedTags.includes(tagId)) {
      // 取消选择
      setFormData(prev => ({
        ...prev,
        selectedTags: prev.selectedTags.filter(id => id !== tagId),
      }));
    } else {
      // 最多选择3个标签
      if (formData.selectedTags.length < 3) {
        setFormData(prev => ({
          ...prev,
          selectedTags: [...prev.selectedTags, tagId],
        }));
      } else {
        setError('最多只能选择3个标签');
        // 3秒后清除错误提示
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.content || !formData.categoryId || formData.selectedTags.length === 0) {
      setError('请填写必填字段');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          categoryId: parseInt(formData.categoryId),
          tagIds: formData.selectedTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '更新文章失败');
      }

      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">编辑文章</h1>
        <Link
          href="/admin/posts"
          className="rounded-lg bg-card px-4 py-2 shadow-sm transition-all hover:bg-accent hover:shadow-md"
        >
          返回列表
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive shadow-md">
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
            className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
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
            className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
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
            className="w-full rounded-lg bg-background px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
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
          <label className="mb-2 block text-sm font-medium">
            文章标签 <span className="text-destructive">*</span> (最多选择3个)
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-all shadow-sm ${
                  formData.selectedTags.includes(tag.id)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md'
                }`}
              >
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={formData.selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="sr-only"
                  disabled={!formData.selectedTags.includes(tag.id) && formData.selectedTags.length >= 3}
                />
                {tag.name}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            已选择 {formData.selectedTags.length}/3 个标签
          </p>
        </div>

        {/* 内容 */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            文章内容 <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full rounded-lg bg-background px-4 py-2 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow hover:shadow-md"
            rows={20}
            placeholder="请输入文章内容，支持 Markdown 格式"
            required
          />
        </div>

        {/* 预览 */}
        {formData.content && (
          <div className="rounded-lg bg-card p-4 shadow-md">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">预览</h3>
            <MarkdownRenderer content={formData.content} />
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : '保存修改'}
          </button>
          <Link
            href="/admin/posts"
            className="rounded-lg bg-card px-6 py-2 shadow-sm transition-all hover:bg-accent hover:shadow-md"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
