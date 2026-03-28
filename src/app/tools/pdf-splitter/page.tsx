import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'PDF Splitter | ToolNest',
  description: 'Split PDF files into separate pages or page ranges. Extract specific pages from your PDF documents.',
  keywords: 'PDF splitter, split PDF, extract PDF pages, separate PDF',
};

export default async function PDFSplitterPage() {
  return <ToolPageClient />;
}
