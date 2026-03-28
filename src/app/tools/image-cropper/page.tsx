import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image Cropper | ToolNest',
  description: 'Crop and cut images to any size. Select custom regions and adjust aspect ratios.',
  keywords: 'image cropper, crop image, cut image, image editor',
};

export default async function ImageCropperPage() {
  return <ToolPageClient />;
}
