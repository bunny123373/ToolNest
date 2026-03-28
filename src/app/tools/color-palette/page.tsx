import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Color Palette Generator | ToolNest',
  description: 'Generate beautiful color palettes from any base color. Perfect for designers and developers.',
  keywords: 'color palette generator, color scheme, complementary colors, color palette',
};

export default async function ColorPalettePage() {
  return <ToolPageClient />;
}
