'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavbarItem } from '@/types/navbar';

const navItems: NavbarItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: 'Categories', href: '/#categories' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">TN</span>
            </div>
            <span className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
              ToolNest
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <Link
              href="/tools"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all duration-200 hover:shadow-glow"
            >
              All Tools
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-text-secondary hover:text-text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="block mt-4 px-4 py-2 bg-primary text-white text-center rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              All Tools
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}