import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Password Generator | ToolNest',
  description: 'Generate secure random passwords with customizable options. Create strong passwords instantly.',
  keywords: 'password generator, random password, secure password, password maker',
};

interface PasswordGeneratorPageProps {
  params: Promise<Record<string, never>>;
}

export default async function PasswordGeneratorPage(_props: PasswordGeneratorPageProps) {
  return <ToolPageClient />;
}