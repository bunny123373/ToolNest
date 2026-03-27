import { Category } from '@/types/category';

export const categories: Category[] = [
  {
    id: 'image',
    name: 'Image Tools',
    icon: '🖼️',
    toolCount: 4,
    description: 'Compress, convert, and edit images',
    route: '/tools?category=image',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    icon: '📄',
    toolCount: 2,
    description: 'Merge, split, and manage PDF files',
    route: '/tools?category=pdf',
  },
  {
    id: 'text',
    name: 'Text Tools',
    icon: '📝',
    toolCount: 4,
    description: 'Analyze and transform text',
    route: '/tools?category=text',
  },
  {
    id: 'utility',
    name: 'Utility Tools',
    icon: '🔧',
    toolCount: 2,
    description: 'Everyday useful utilities',
    route: '/tools?category=utility',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    icon: '💻',
    toolCount: 5,
    description: 'Tools for developers',
    route: '/tools?category=developer',
  },
];