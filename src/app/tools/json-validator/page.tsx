import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'JSON Validator | ToolNest',
  description: 'Validate, format, and minify JSON. Check JSON syntax instantly.',
};

export default function Page() {
  return <ToolPageClient />;
}