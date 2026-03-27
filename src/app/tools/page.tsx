import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';

export const metadata: Metadata = {
  title: 'All Tools | ToolNest',
  description: 'Browse all free online tools. Image tools, PDF tools, text tools, and more.',
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">All Tools</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Explore our collection of free online tools. Fast, simple, and powerful utilities for everyday work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}