'use client';

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = '' }: AdBannerProps) {
  return (
    <div className={`ad-banner ${className}`} style={{ display: 'none' }}>
      <div className="min-h-[90px]" />
    </div>
  );
}

export function AdSidebar() {
  return (
    <div className="ad-sidebar" style={{ display: 'none' }}>
      <div className="min-h-[250px]" />
    </div>
  );
}

export function AdInArticle() {
  return (
    <div className="ad-in-article" style={{ display: 'none' }}>
      <div className="min-h-[60px]" />
    </div>
  );
}