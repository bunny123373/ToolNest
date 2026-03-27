import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'PDF Merger | ToolNest',
  description: 'Merge multiple PDF files into one document. Fast and free online PDF merger.',
  keywords: 'PDF merger, merge PDF, combine PDF, join PDF files',
};

interface PdfMergerPageProps {
  params: Promise<Record<string, never>>;
}

export default async function PdfMergerPage(_props: PdfMergerPageProps) {
  return <ToolPageClient />;
}