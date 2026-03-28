import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'UUID Generator | ToolNest',
  description: 'Generate unique UUIDs (v4) instantly. Create universally unique identifiers for your projects.',
  keywords: 'UUID generator, GUID generator, unique identifier, UUID v4',
};

export default async function UUIDGeneratorPage() {
  return <ToolPageClient />;
}
