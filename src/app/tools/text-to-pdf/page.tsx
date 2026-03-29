import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Text to PDF Converter | ToolNest',
  description: 'Convert text to PDF online. Fast and free text to PDF converter.',
  keywords: 'text to pdf, convert text to pdf, create pdf from text',
};

interface TextToPdfPageProps {
  params: Promise<Record<string, never>>;
}

export default async function TextToPdfPage(_props: TextToPdfPageProps) {
  return <ToolPageClient />;
}