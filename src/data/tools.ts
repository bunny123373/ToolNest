import { Tool } from '@/types/tool';

export const tools: Tool[] = [
  {
    id: 'youtube-thumbnail',
    title: 'YouTube Thumbnail Downloader',
    description: 'Download high-quality YouTube video thumbnails instantly',
    route: '/tools/youtube-thumbnail-downloader',
    category: 'image',
    icon: '🎬',
    badge: 'trending',
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress images while maintaining quality',
    route: '/tools/image-compressor',
    category: 'image',
    icon: '🗜️',
  },
  {
    id: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Merge multiple PDF files into one document',
    route: '/tools/pdf-merger',
    category: 'pdf',
    icon: '📑',
    badge: 'recent',
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Generate QR codes for URLs and text',
    route: '/tools/qr-generator',
    category: 'utility',
    icon: '🔳',
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, and sentences in your text',
    route: '/tools/word-counter',
    category: 'text',
    icon: '📊',
    badge: 'popular',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure random passwords',
    route: '/tools/password-generator',
    category: 'developer',
    icon: '🔐',
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    route: '/tools/base64-encoder',
    category: 'developer',
    icon: '🔤',
    badge: 'recent',
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON',
    route: '/tools/json-formatter',
    category: 'developer',
    icon: '📋',
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Shorten long URLs instantly',
    route: '/tools/url-shortener',
    category: 'utility',
    icon: '🔗',
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs',
    route: '/tools/lorem-ipsum',
    category: 'text',
    icon: '📝',
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, HSV',
    route: '/tools/color-converter',
    category: 'developer',
    icon: '🎨',
  },
];

export const getTrendingTools = (): Tool[] => {
  return tools.filter((tool) => tool.badge === 'trending');
};

export const getRecentTools = (): Tool[] => {
  return tools.filter((tool) => tool.badge === 'recent');
};

export const getPopularTools = (): Tool[] => {
  return tools.filter((tool) => tool.badge === 'popular');
};

export const getToolsByCategory = (categoryId: string): Tool[] => {
  return tools.filter((tool) => tool.category === categoryId);
};

export const searchTools = (query: string): Tool[] => {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery)
  );
};