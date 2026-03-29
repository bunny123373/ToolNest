import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter | ToolNest',
  description: 'Convert JSON data to CSV format instantly. Perfect for data migration and analysis.',
  keywords: 'JSON to CSV, CSV converter, JSON converter, data conversion',
};

export default async function JSONToCSVPage() {
  return <ToolPageClient />;
}
