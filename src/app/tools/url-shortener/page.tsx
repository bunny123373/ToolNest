import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'URL Shortener | ToolNest',
  description: 'Shorten URLs instantly with our free URL shortener tool.',
  keywords: 'url shortener, link shortener, shorten url, free url shortener',
};

interface UrlShortenerPageProps {
  params: Promise<Record<string, never>>;
}

export default async function UrlShortenerPage(_props: UrlShortenerPageProps) {
  return <ToolPageClient />;
}