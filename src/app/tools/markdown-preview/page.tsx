import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Markdown Preview | ToolNest',
  description: 'Preview and edit Markdown in real-time. See your formatted content instantly as you type.',
  keywords: 'markdown preview, markdown editor, markdown converter, markdown renderer',
};

export default async function MarkdownPreviewPage() {
  return <ToolPageClient />;
}
