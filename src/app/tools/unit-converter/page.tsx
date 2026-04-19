import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Unit Converter | ToolNest',
  description: 'Convert between different units of measurement. Length, weight, temperature, and more.',
  keywords: 'unit converter, measurement converter, length converter, weight converter, temperature converter',
};

export default async function UnitConverterPage() {
  return <ToolPageClient />;
}
