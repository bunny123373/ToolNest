import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Color Converter | ToolNest',
  description: 'Convert between HEX, RGB, HSL, and HSV color formats. Free online color converter.',
  keywords: 'color converter, hex to rgb, color format converter, color picker',
};

interface ColorConverterPageProps {
  params: Promise<Record<string, never>>;
}

export default async function ColorConverterPage(_props: ColorConverterPageProps) {
  return <ToolPageClient />;
}