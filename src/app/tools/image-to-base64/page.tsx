import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Image to Base64 Converter | ToolNest',
  description: 'Convert images to Base64 string instantly. Encode images for embedding in HTML, CSS, or JSON.',
};

export default function Page() {
  return <ToolPageClient />;
}