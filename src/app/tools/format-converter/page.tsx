import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Format Converter | ToolNest',
  description: 'Convert between JSON, XML, and YAML formats online',
  keywords: 'format converter, json to xml, json to yaml, xml to json, yaml to json',
};

interface FormatConverterPageProps {
  params: Promise<Record<string, never>>;
}

export default async function FormatConverterPage(_props: FormatConverterPageProps) {
  return <ToolPageClient />;
}