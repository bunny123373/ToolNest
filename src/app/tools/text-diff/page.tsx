import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Text Diff | ToolNest',
  description: 'Compare two texts and see the differences',
  keywords: 'text diff, compare text, text difference, text compare',
};

interface TextDiffPageProps {
  params: Promise<Record<string, never>>;
}

export default async function TextDiffPage(_props: TextDiffPageProps) {
  return <ToolPageClient />;
}