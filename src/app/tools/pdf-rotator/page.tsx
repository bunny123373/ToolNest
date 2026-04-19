import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'PDF Rotator | ToolNest',
  description: 'Rotate PDF pages by 90, 180, or 270 degrees. Rotate all pages or select specific ones.',
  keywords: 'PDF rotator, rotate PDF, rotate PDF pages, PDF editor',
};

export default async function PDFRotatorPage() {
  return <ToolPageClient />;
}
