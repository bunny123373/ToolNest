import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'JSON Formatter | ToolNest',
  description: 'Format, validate, and minify JSON online. Free JSON formatter and validator tool.',
  keywords: 'json formatter, json validator, json minify, format json',
};

interface JsonFormatterPageProps {
  params: Promise<Record<string, never>>;
}

export default async function JsonFormatterPage(_props: JsonFormatterPageProps) {
  return <ToolPageClient />;
}