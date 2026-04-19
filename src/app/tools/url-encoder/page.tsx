import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder | ToolNest',
  description: 'Encode and decode URL components safely',
  keywords: 'url encoder, url decoder, encode url, decode url',
};

interface UrlEncoderPageProps {
  params: Promise<Record<string, never>>;
}

export default async function UrlEncoderPage(_props: UrlEncoderPageProps) {
  return <ToolPageClient />;
}