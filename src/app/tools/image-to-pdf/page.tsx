import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image to PDF Converter | ToolNest',
  description: 'Convert images to PDF online. Fast and free image to PDF converter.',
  keywords: 'image to pdf, convert image to pdf, jpg to pdf, png to pdf',
};

interface ImageToPdfPageProps {
  params: Promise<Record<string, never>>;
}

export default async function ImageToPdfPage(_props: ImageToPdfPageProps) {
  return <ToolPageClient />;
}