import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator | ToolNest',
  description: 'Generate Lorem Ipsum placeholder text for your designs. Free online generator.',
  keywords: 'lorem ipsum generator, placeholder text, dummy text generator',
};

interface LoremIpsumPageProps {
  params: Promise<Record<string, never>>;
}

export default async function LoremIpsumPage(_props: LoremIpsumPageProps) {
  return <ToolPageClient />;
}