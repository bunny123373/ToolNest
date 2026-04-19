import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image Downloader | ToolNest',
  description: 'Download any image from a URL. Fast and free online image downloader.',
  keywords: 'image downloader, download image from url, save image',
};

interface ImageDownloaderPageProps {
  params: Promise<Record<string, never>>;
}

export default async function ImageDownloaderPage(_props: ImageDownloaderPageProps) {
  return <ToolPageClient />;
}