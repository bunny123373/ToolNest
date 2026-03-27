import HeroSection from '@/components/HeroSection';
import SectionHeading from '@/components/SectionHeading';
import ToolCard from '@/components/ToolCard';
import CategoryCard from '@/components/CategoryCard';
import AdBanner from '@/components/ads/AdBanner';
import { tools, getTrendingTools, getRecentTools, getPopularTools } from '@/data/tools';
import { categories } from '@/data/categories';

export default function Home() {
  const trendingTools = getTrendingTools();
  const recentTools = getRecentTools();
  const popularTools = getPopularTools();

  return (
    <>
      <HeroSection />

      <div className="px-4">
        <div className="max-w-7xl mx-auto py-8">
          <AdBanner />
        </div>
      </div>

      <section id="categories" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Browse by Category"
            subtitle="Find the right tool for your needs"
            align="center"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Trending Tools"
            subtitle="Most popular tools this week"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
            {trendingTools.length === 0 && tools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <div className="px-4">
        <div className="max-w-7xl mx-auto py-8">
          <AdBanner />
        </div>
      </div>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Recent Tools"
            subtitle="Latest additions to our toolbox"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTools.length > 0 ? (
              recentTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            ) : (
              tools.slice(3, 6).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Popular Tools"
            subtitle="Top rated by our users"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.length > 0 ? (
              popularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            ) : (
              tools.slice(0, 6).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
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