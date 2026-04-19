import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Timestamp Converter | ToolNest',
  description: 'Convert Unix timestamps to dates and vice versa. Quick and easy timestamp conversion.',
};

export default function Page() {
  return <ToolPageClient />;
}