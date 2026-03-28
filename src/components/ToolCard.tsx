'use client';

import Link from 'next/link';
import { Tool } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const badgeColors = {
    trending: 'bg-orange-500/20 text-orange-400',
    recent: 'bg-blue-500/20 text-blue-400',
    popular: 'bg-purple-500/20 text-purple-400',
    new: 'bg-green-500/20 text-green-400',
  };

  return (
    <Link href={tool.route}>
      <div className="group relative p-6 bg-surface-elevated border border-border rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-pointer">
        {tool.badge && (
          <span className={`absolute -top-2 -right-2 px-3 py-1 text-xs font-medium rounded-full ${badgeColors[tool.badge]}`}>
            {tool.badge}
          </span>
        )}
        
        <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {tool.icon}
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
          {tool.title}
        </h3>
        
        <p className="text-text-secondary text-sm line-clamp-2">
          {tool.description}
        </p>
        
        <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Use Tool</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}