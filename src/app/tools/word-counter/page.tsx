import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Word Counter | ToolNest',
  description: 'Count words, characters, sentences, and estimate reading time. Free online text analyzer.',
  keywords: 'word counter, character count, sentence count, text analyzer, reading time',
};

interface WordCounterPageProps {
  params: Promise<Record<string, never>>;
}

export default async function WordCounterPage(_props: WordCounterPageProps) {
  return <ToolPageClient />;
}