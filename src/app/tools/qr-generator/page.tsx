import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'QR Code Generator | ToolNest',
  description: 'Generate QR codes for any URL or text. Fast, free, and no sign-up required.',
  keywords: 'QR code generator, create QR code, QR code maker, QR code online',
};

interface QrGeneratorPageProps {
  params: Promise<Record<string, never>>;
}

export default async function QrGeneratorPage(_props: QrGeneratorPageProps) {
  return <ToolPageClient />;
}