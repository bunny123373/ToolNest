import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder | ToolNest',
  description: 'Encode and decode Base64 strings online. Free Base64 encoder and decoder tool.',
  keywords: 'base64 encoder, base64 decoder, encode decode base64',
};

interface Base64EncoderPageProps {
  params: Promise<Record<string, never>>;
}

export default async function Base64EncoderPage(_props: Base64EncoderPageProps) {
  return <ToolPageClient />;
}