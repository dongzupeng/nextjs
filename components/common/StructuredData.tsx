/**
 * 结构化数据组件
 * 用于在页面中添加符合 Schema.org 标准的 JSON-LD 格式结构化数据
 */
import React from 'react';

interface StructuredDataProps {
  data: any;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
