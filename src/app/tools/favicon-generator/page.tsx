import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Favicon Generator | ToolNest',
  description: 'Generate favicon from text, emoji, or image. Create favicons for your website in seconds.',
  keywords: 'favicon generator, favicon maker, website icon, favicon converter',
};

export default async function FaviconGeneratorPage() {
  return <ToolPageClient />;
}
