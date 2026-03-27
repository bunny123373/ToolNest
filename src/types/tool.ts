export interface Tool {
  id: string;
  title: string;
  description: string;
  route: string;
  category: string;
  icon: string;
  badge?: 'trending' | 'recent' | 'popular';
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  toolCount: number;
  description: string;
}

export interface NavbarItem {
  label: string;
  href: string;
  icon?: string;
}