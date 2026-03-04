'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/blog';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 加载分类列表
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('加载分类失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理添加分类
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '创建分类失败');
      }

      setSuccess('分类创建成功');
      setShowAddForm(false);
      setFormData({ name: '', slug: '', description: '' });
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 处理编辑分类
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
  };

  // 处理更新分类
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!editingCategory) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: editingCategory.id
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '更新分类失败');
      }

      setSuccess('分类更新成功');
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '' });
      loadCategories();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 处理删除分类
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除分类失败');
      }

      setSuccess('分类删除成功');
      loadCategories();
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
        <h1 className="text-3xl font-bold">分类管理</h1>
        {!editingCategory && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showAddForm ? '取消' : '添加分类'}
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

      {/* 添加/编辑分类表单 */}
      {(showAddForm || editingCategory) && (
        <form
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          className="mb-8 rounded-lg bg-card p-6 shadow-md"
        >
          <h2 className="mb-4 text-xl font-semibold">
            {editingCategory ? '编辑分类' : '添加分类'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                分类名称 <span className="text-destructive">*</span>
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
                分类Slug <span className="text-destructive">*</span>
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
            <div>
              <label className="mb-2 block text-sm font-medium">
                分类描述
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
              >
                {editingCategory ? '更新分类' : '添加分类'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: '', slug: '', description: '' });
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

      {/* 分类列表 */}
      {categories.length === 0 ? (
        <div className="rounded-lg bg-card p-8 text-center shadow-md">
          <p className="text-muted-foreground">暂无分类，点击上方按钮创建新分类</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <table className="w-full">
            <thead className="bg-muted shadow-sm">
              <tr>
                {/* <th className="px-4 py-3 text-left text-sm font-medium">ID</th> */}
                <th className="px-4 py-3 text-left text-sm font-medium">名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium">描述</th>
                <th className="px-4 py-3 text-left text-sm font-medium">文章数量</th>
                <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="bg-card transition-colors hover:bg-accent/50">
                  {/* <td className="px-4 py-3">{category.id}</td> */}
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.slug}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{category.slug}</td>
                  <td className="px-4 py-3 text-sm">{category.description || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs shadow-sm">
                      {category.postCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="rounded px-3 py-1 text-sm transition-all hover:bg-accent hover:shadow-md"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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
