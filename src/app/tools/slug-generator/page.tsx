import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Slug Generator | ToolNest',
  description: 'Create URL-friendly slugs from text. Perfect for blog posts, articles, and SEO-friendly URLs.',
  keywords: 'slug generator, URL slug, SEO friendly URL, text to slug',
};

export default async function SlugGeneratorPage() {
  return <ToolPageClient />;
}
