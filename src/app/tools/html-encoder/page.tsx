import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'HTML Encoder/Decoder | ToolNest',
  description: 'Encode and decode HTML entities. Safely escape HTML for web development and content display.',
  keywords: 'HTML encoder, HTML decoder, HTML entities, escape HTML, unescape HTML',
};

export default async function HTMLEncoderPage() {
  return <ToolPageClient />;
}
