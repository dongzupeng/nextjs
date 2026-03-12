/**
 * 页面底部组件
 */
import { siteConfig } from '@/lib/config';

/**
 * 底部组件，包含版权信息和社交媒体链接
 */
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" aria-label="页面底部信息">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* 版权信息 */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          
          {/* 社交媒体链接 */}
          <nav aria-label="社交媒体链接">
            <ul className="flex gap-4">
              {siteConfig.links.github && (
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    aria-label="访问GitHub"
                  >
                    GitHub
                  </a>
                </li>
              )}
              {siteConfig.links.twitter && (
                <li>
                  <a
                    href={siteConfig.links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    aria-label="访问Twitter"
                  >
                    Twitter
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
