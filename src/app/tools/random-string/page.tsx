import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Random String Generator | ToolNest',
  description: 'Generate random strings with custom patterns',
  keywords: 'random string generator, random password, random text generator',
};

interface RandomStringPageProps {
  params: Promise<Record<string, never>>;
}

export default async function RandomStringPage(_props: RandomStringPageProps) {
  return <ToolPageClient />;
}