import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image Compressor | ToolNest',
  description: 'Compress images online while maintaining quality. Reduce file size without losing visual quality.',
  keywords: 'image compressor, compress image, reduce image size, optimize image',
};

interface ImageCompressorPageProps {
  params: Promise<Record<string, never>>;
}

export default async function ImageCompressorPage(_props: ImageCompressorPageProps) {
  return <ToolPageClient />;
}