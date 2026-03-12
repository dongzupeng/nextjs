/**
 * 根布局组件
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/common/StructuredData";
import { siteConfig } from "@/lib/config";
import { generateWebsiteStructuredData } from "@/lib/structured-data";

// 加载 Geist 字体
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 站点元数据配置
 */
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["博客", "技术", "生活", "随笔", "Next.js", "Prisma"],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.links.github,
    },
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    siteName: siteConfig.name,
  },
  twitter: {
    title: siteConfig.name,
    description: siteConfig.description,
    card: "summary_large_image",
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: {
      url: '/logo.png',
      sizes: '32x32',
      type: 'image/png',
    },
    apple: {
      url: '/logo.png',
      sizes: '180x180',
      type: 'image/png',
    },
    shortcut: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: 'width=device-width, initial-scale=1',
  category: 'Technology',
};

/**
 * 根布局组件，包裹整个应用
 * @param children 子组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="format-detection" content="telephone=no" />
        <StructuredData data={generateWebsiteStructuredData()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          {/* 头部组件 */}
          <Header />
          {/* 主内容区域 */}
          <main className="flex-1 pb-20">{children}</main>
          {/* 底部组件 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
