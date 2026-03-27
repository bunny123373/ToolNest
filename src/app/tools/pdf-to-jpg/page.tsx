import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter | ToolNest',
  description: 'Convert PDF pages to high-quality JPG images online. Fast and free.',
  keywords: 'pdf to jpg, pdf converter, convert pdf to image',
};

interface PdfToJpgPageProps {
  params: Promise<Record<string, never>>;
}

export default async function PdfToJpgPage(_props: PdfToJpgPageProps) {
  return <ToolPageClient />;
}