import HeroSection from '@/components/HeroSection';
import SectionHeading from '@/components/SectionHeading';
import ToolCard from '@/components/ToolCard';
import AdBanner from '@/components/ads/AdBanner';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import Link from 'next/link';

export default function Home() {
  const featuredTools = tools.filter(t => ['youtube-thumbnail', 'image-compressor', 'pdf-merger', 'qr-generator', 'password-generator', 'json-formatter'].includes(t.id));
  const developerTools = tools.filter(t => t.category === 'developer').slice(0, 6);
  const imageTools = tools.filter(t => t.category === 'image').slice(0, 6);

  return (
    <>
      <HeroSection />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.route}
                className="group flex flex-col items-center gap-3 p-5 bg-surface-elevated border border-border rounded-2xl hover:border-primary/40 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{category.toolCount} tools</p>
                </div>
              </Link>
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
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Most Popular"
            subtitle="Tools our users love the most"
            align="center"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {featuredTools.slice(0, 6).map((tool, index) => (
              <Link
                key={tool.id}
                href={tool.route}
                className="group p-5 bg-surface-elevated border border-border rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
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
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Developer Tools"
            subtitle="Essential tools for developers"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {developerTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Image Tools"
            subtitle="Everything you need for image processing"
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-surface-elevated to-surface border border-border rounded-2xl">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Ready to get started?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Explore our collection of free online tools. No registration required, 
              no hidden fees. Just fast, reliable tools.
            </p>
            <a
              href="/tools"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              View All Tools
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}