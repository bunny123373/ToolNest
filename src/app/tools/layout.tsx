import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Tools | ToolNest',
  description: 'Browse all free online tools. Image tools, PDF tools, text tools, and more.',
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}