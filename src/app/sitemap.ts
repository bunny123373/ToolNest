import { Metadata } from 'next';
import { tools } from '@/data/tools';

const baseUrl = 'https://toolnest.com';

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default function sitemap() {
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/tools',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 0.9 : 0.6,
    })),
    ...toolUrls,
  ];
}