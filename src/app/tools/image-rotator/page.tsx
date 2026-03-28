import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image Rotator | ToolNest',
  description: 'Rotate images by 90, 180, or any degree. Flip images horizontally or vertically.',
  keywords: 'image rotator, rotate image, flip image, image transformation',
};

export default async function ImageRotatorPage() {
  return <ToolPageClient />;
}
