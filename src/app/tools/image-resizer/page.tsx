import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image Resizer | ToolNest',
  description: 'Resize images to any dimension while maintaining quality. Perfect for social media and web optimization.',
  keywords: 'image resizer, resize image, image size, photo resize',
};

export default async function ImageResizerPage() {
  return <ToolPageClient />;
}
