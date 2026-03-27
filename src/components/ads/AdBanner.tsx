'use client';

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div className={`ad-banner ${className}`}>
      <div className="min-h-[90px] flex items-center justify-center bg-surface-elevated/50 border border-dashed border-border rounded-xl">
        <span className="text-text-secondary text-sm">
          Ad Banner (728x90) - Placeholder
        </span>
      </div>
    </div>
  );
}

export function AdSidebar() {
  return (
    <div className="ad-sidebar">
      <div className="min-h-[250px] flex items-center justify-center bg-surface-elevated/50 border border-dashed border-border rounded-xl">
        <span className="text-text-secondary text-sm">
          Ad Sidebar (300x250) - Placeholder
        </span>
      </div>
    </div>
  );
}

export function AdInArticle() {
  return (
    <div className="ad-in-article">
      <div className="min-h-[60px] flex items-center justify-center bg-surface-elevated/50 border border-dashed border-border rounded-lg">
        <span className="text-text-secondary text-xs">
          In-Article Ad - Placeholder
        </span>
      </div>
    </div>
  );
}