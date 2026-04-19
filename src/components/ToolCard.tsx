'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Tool } from '@/types/tool';
import Icon from './Icon';

interface ToolCardProps {
  tool: Tool;
}

const FAVORITES_KEY = 'toolnest_favorites';

function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsFavorite(getStoredFavorites().includes(tool.id));
  }, [tool.id]);

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = getStoredFavorites();
    const newFavorites = current.includes(tool.id)
      ? current.filter((id) => id !== tool.id)
      : [...current, tool.id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  }, [tool.id, isFavorite]);

  const badgeColors: Record<string, string> = {
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

        {isMounted && (
          <button
            onClick={toggleFavorite}
            className={`absolute -top-2 -left-2 p-2 rounded-full transition-colors ${
              isFavorite ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
            }`}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        
        <div className="w-10 h-10 mb-4 transform group-hover:scale-110 transition-transform duration-300 text-primary">
          <Icon name={tool.icon} />
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