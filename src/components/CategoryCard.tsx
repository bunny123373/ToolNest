'use client';

import Link from 'next/link';
import { Category } from '@/types/category';
import Icon from './Icon';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.route}>
      <div className="group p-6 bg-surface-elevated border border-border rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-pointer">
        <div className="w-12 h-12 mb-4 transform group-hover:scale-110 transition-transform duration-300 text-primary">
          <Icon name={category.icon} />
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        
        <p className="text-text-secondary text-sm mb-3">
          {category.description}
        </p>
        
        <span className="inline-flex items-center px-3 py-1 bg-surface-hover rounded-full text-sm text-text-secondary">
          {category.toolCount} tools
        </span>
      </div>
    </Link>
  );
}