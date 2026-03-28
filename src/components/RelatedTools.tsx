'use client';

import { Tool } from '@/types/tool';
import ToolCard from './ToolCard';

interface RelatedToolsProps {
  tools: Tool[];
  title?: string;
}

export default function RelatedTools({ tools, title = 'Related Tools' }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-semibold text-text-primary mb-6">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
