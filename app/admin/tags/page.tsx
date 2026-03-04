'use client';

import { useState, useEffect } from 'react';
import { Tag } from '@/types/blog';

export default function TagManagementPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 加载标签列表
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error('加载标签失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理添加标签
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '创建标签失败');
      }

      setSuccess('标签创建成功');
      setShowAddForm(false);
      setFormData({ name: '', slug: '' });
      loadTags();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 处理编辑标签
  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug
    });
  };

  // 处理更新标签
  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!editingTag) return;

    try {
      const response = await fetch('/api/tags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: editingTag.id
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '更新标签失败');
      }

      setSuccess('标签更新成功');
      setEditingTag(null);
      setFormData({ name: '', slug: '' });
      loadTags();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 处理删除标签
  const handleDeleteTag = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？')) return;
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/tags', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除标签失败');
      }

      setSuccess('标签删除成功');
      loadTags();
    } catch (err) {
      setError((err as Error).message);
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
        <h1 className="text-3xl font-bold">标签管理</h1>
        {!editingTag && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showAddForm ? '取消' : '添加标签'}
          </button>
        )}
      </div>

      {/* 消息提示 */}
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-success/10 p-4 text-success">
          {success}
        </div>
      )}

      {/* 添加/编辑标签表单 */}
      {(showAddForm || editingTag) && (
        <form
          onSubmit={editingTag ? handleUpdateTag : handleAddTag}
          className="mb-8 rounded-lg bg-card p-6 shadow-md"
        >
          <h2 className="mb-4 text-xl font-semibold">
            {editingTag ? '编辑标签' : '添加标签'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                标签名称 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                标签Slug <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
              >
                {editingTag ? '更新标签' : '添加标签'}
              </button>
              {editingTag && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingTag(null);
                    setFormData({ name: '', slug: '' });
                  }}
                  className="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground transition-all hover:bg-secondary/80 hover:shadow-md"
                >
                  取消
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* 标签列表 */}
      {tags.length === 0 ? (
        <div className="rounded-lg bg-card p-8 text-center shadow-md">
          <p className="text-muted-foreground">暂无标签，点击上方按钮创建新标签</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <table className="w-full">
            <thead className="bg-muted shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium">文章数量</th>
                <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="bg-card transition-colors hover:bg-accent/50">
                  <td className="px-4 py-3">{tag.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{tag.name}</div>
                      <div className="text-sm text-muted-foreground">{tag.slug}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{tag.slug}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs shadow-sm">
                      {tag.postCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTag(tag)}
                        className="rounded px-3 py-1 text-sm transition-all hover:bg-accent hover:shadow-md"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="rounded px-3 py-1 text-sm text-destructive transition-all hover:bg-destructive/10 hover:shadow-md"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
