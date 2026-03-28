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
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to any dimension while maintaining quality',
    route: '/tools/image-resizer',
    category: 'image',
    icon: '📐',
  },
  {
    id: 'image-rotator',
    title: 'Image Rotator',
    description: 'Rotate and flip images with ease',
    route: '/tools/image-rotator',
    category: 'image',
    icon: '🔄',
  },
  {
    id: 'image-downloader',
    title: 'Image Downloader',
    description: 'Download any image from a URL',
    route: '/tools/image-downloader',
    category: 'image',
    icon: '📥',
    badge: 'trending',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    description: 'Convert multiple images to a single PDF',
    route: '/tools/image-to-pdf',
    category: 'image',
    icon: '📑',
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator',
    description: 'Create favicons from text or emoji for your website',
    route: '/tools/favicon-generator',
    category: 'image',
    icon: '🌐',
    badge: 'new',
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images to any size with custom aspect ratios',
    route: '/tools/image-cropper',
    category: 'image',
    icon: '✂️',
    badge: 'new',
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
    id: 'pdf-to-jpg',
    title: 'PDF to JPG Converter',
    description: 'Convert PDF pages to high-quality JPG images',
    route: '/tools/pdf-to-jpg',
    category: 'pdf',
    icon: '📸',
  },
  {
    id: 'pdf-splitter',
    title: 'PDF Splitter',
    description: 'Split PDF files into separate pages or page ranges',
    route: '/tools/pdf-splitter',
    category: 'pdf',
    icon: '✂️',
    badge: 'new',
  },
  {
    id: 'pdf-rotator',
    title: 'PDF Rotator',
    description: 'Rotate PDF pages by 90, 180, or 270 degrees',
    route: '/tools/pdf-rotator',
    category: 'pdf',
    icon: '🔄',
    badge: 'new',
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
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between different units of measurement',
    route: '/tools/unit-converter',
    category: 'utility',
    icon: '⚖️',
    badge: 'new',
  },
  {
    id: 'color-palette',
    title: 'Color Palette Generator',
    description: 'Generate beautiful color palettes from any base color',
    route: '/tools/color-palette',
    category: 'utility',
    icon: '🎨',
    badge: 'new',
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
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, and sentences in your text',
    route: '/tools/word-counter',
    category: 'text',
    icon: '📊',
    badge: 'popular',
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
    id: 'text-to-pdf',
    title: 'Text to PDF Converter',
    description: 'Convert text to PDF document',
    route: '/tools/text-to-pdf',
    category: 'text',
    icon: '📄',
  },
  {
    id: 'markdown-preview',
    title: 'Markdown Preview',
    description: 'Write Markdown and see it rendered in real-time',
    route: '/tools/markdown-preview',
    category: 'text',
    icon: '📋',
    badge: 'new',
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
    id: 'json-to-csv',
    title: 'JSON to CSV Converter',
    description: 'Convert JSON arrays to CSV format instantly',
    route: '/tools/json-to-csv',
    category: 'developer',
    icon: '📊',
    badge: 'new',
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, HSV',
    route: '/tools/color-converter',
    category: 'developer',
    icon: '🎨',
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate unique UUIDs (v4) instantly',
    route: '/tools/uuid-generator',
    category: 'developer',
    icon: '🔑',
    badge: 'new',
  },
  {
    id: 'slug-generator',
    title: 'Slug Generator',
    description: 'Create URL-friendly slugs from text',
    route: '/tools/slug-generator',
    category: 'developer',
    icon: '🔗',
    badge: 'new',
  },
  {
    id: 'html-encoder',
    title: 'HTML Encoder/Decoder',
    description: 'Encode and decode HTML entities safely',
    route: '/tools/html-encoder',
    category: 'developer',
    icon: '🏷️',
    badge: 'new',
  },
  {
    id: 'email-validator',
    title: 'Email Validator',
    description: 'Validate email addresses instantly',
    route: '/tools/email-validator',
    category: 'developer',
    icon: '✉️',
    badge: 'new',
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