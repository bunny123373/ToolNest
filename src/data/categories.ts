import { Category } from '@/types/category';

export const categories: Category[] = [
  {
    id: 'image',
    name: 'Image Tools',
    icon: 'image',
    toolCount: 10,
    description: 'Compress, convert, resize, crop, and edit images',
    route: '/tools?category=image',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    icon: 'pdf',
    toolCount: 4,
    description: 'Merge, split, rotate, and manage PDF files',
    route: '/tools?category=pdf',
  },
  {
    id: 'text',
    name: 'Text Tools',
    icon: 'text-tools',
    toolCount: 4,
    description: 'Analyze, transform, and preview text',
    route: '/tools?category=text',
  },
  {
    id: 'utility',
    name: 'Utility Tools',
    icon: 'utility',
    toolCount: 4,
    description: 'Everyday useful utilities',
    route: '/tools?category=utility',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    icon: 'developer',
    toolCount: 17,
    description: 'Tools for developers',
    route: '/tools?category=developer',
  },
];