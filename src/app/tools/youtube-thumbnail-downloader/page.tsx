import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Downloader | ToolNest',
  description: 'Download high-quality YouTube video thumbnails instantly. Extract thumbnails in maximum resolution.',
  keywords: 'YouTube thumbnail downloader, download YouTube thumbnail, thumbnail extractor',
};

interface YouTubeThumbnailDownloaderPageProps {
  params: Promise<Record<string, never>>;
}

export default async function YouTubeThumbnailDownloaderPage(_props: YouTubeThumbnailDownloaderPageProps) {
  return <ToolPageClient />;
}