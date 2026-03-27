import { tools } from '@/data/tools';

const baseUrl = 'https://toolsbar.vercel.app';

export const dynamic = 'force-dynamic';

export async function GET() {
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = ['', '/tools', '/about'];

  const allUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}