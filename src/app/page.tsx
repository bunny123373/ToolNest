import HeroSection from '@/components/HeroSection';
import SectionHeading from '@/components/SectionHeading';
import ToolCard from '@/components/ToolCard';
import Icon from '@/components/Icon';
import AdBanner from '@/components/ads/AdBanner';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import Link from 'next/link';

export default function Home() {
  const featuredTools = tools.filter(t => ['youtube-thumbnail', 'image-compressor', 'pdf-merger', 'qr-generator', 'password-generator', 'json-formatter'].includes(t.id));
  const imageTools = tools.filter(t => t.category === 'image').slice(0, 6);
  const devTools = tools.filter(t => t.category === 'developer').slice(0, 6);

  return (
    <>
      <HeroSection />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Browse by Category"
            subtitle="Find the tool you need, fast"
            align="center"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category, idx) => (
              <Link
                key={category.id}
                href={category.route}
                className="group flex flex-col items-center gap-3 p-5 bg-surface-elevated border border-border rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Icon name={category.icon} className="w-6 h-6 text-text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{category.toolCount} tools</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Fast & Easy', desc: 'No uploads needed for most tools. Process directly in your browser.' },
              { icon: '🔒', title: 'Secure', desc: 'Your files never leave your device. 100% privacy guaranteed.' },
              { icon: '🎁', title: 'Completely Free', desc: 'No registration, no hidden fees. Every tool is free forever.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 bg-surface-elevated/50 border border-border/50 rounded-2xl hover:border-primary/30 transition-all">
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl mx-auto mb-4">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AdBanner />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Most Popular"
            subtitle="Tools our users love the most"
            align="center"
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredTools.map((tool, index) => (
              <Link
                key={tool.id}
                href={tool.route}
                className="group p-5 bg-surface-elevated border border-border rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon name={tool.icon} className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">{tool.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated hover:bg-surface-hover border border-border rounded-xl text-text-secondary hover:text-text-primary transition-all"
            >
              View all tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <AdBanner />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Image Tools"
            subtitle="Everything you need for image processing"
            align="center"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/tools?category=image"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated hover:bg-surface-hover border border-border rounded-xl text-text-secondary hover:text-text-primary transition-all"
            >
              View all image tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Developer Tools"
            subtitle="Essential tools for developers"
            align="center"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {devTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-16 bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                Ready to get started?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Explore our collection of free online tools. No registration required,
                no hidden fees. Just fast, reliable tools.
              </p>
              <a
                href="/tools"
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all hover:shadow-glow hover:scale-105"
              >
                Explore All Tools
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}