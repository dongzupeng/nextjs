/**
 * Markdown 渲染组件
 * 支持 GitHub Flavored Markdown 和代码高亮
 */
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义代码块渲染
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative group">
                <div className="absolute right-2 top-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {match[1]}
                </div>
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          // 自定义标题渲染，添加锚点
          h1({ children, ...props }: any) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return (
              <h1 id={id} className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return (
              <h2 id={id} className="text-2xl font-bold mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            const id = String(children).toLowerCase().replace(/\s+/g, '-');
            return (
              <h3 id={id} className="text-xl font-bold mt-5 mb-2" {...props}>
                {children}
              </h3>
            );
          },
          // 自定义引用块
          blockquote({ children, ...props }: any) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r" {...props}>
                {children}
              </blockquote>
            );
          },
          // 自定义表格
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
                {children}
              </td>
            );
          },
          // 自定义列表
          ul({ children, ...props }: any) {
            return (
              <ul className="list-disc list-inside my-4 space-y-1" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol className="list-decimal list-inside my-4 space-y-1" {...props}>
                {children}
              </ol>
            );
          },
          // 自定义链接
          a({ children, ...props }: any) {
            return (
              <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
          // 自定义图片
          img({ ...props }: any) {
            return (
              <img className="max-w-full h-auto rounded-lg shadow-md my-4" {...props} />
            );
          },
          // 自定义水平线
          hr({ ...props }: any) {
            return (
              <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
