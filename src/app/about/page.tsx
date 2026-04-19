import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | ToolNest',
  description: 'Learn about ToolNest - your destination for free online tools. Fast, simple, and powerful utilities for everyday work.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6">
            <span className="text-white font-bold text-2xl">TN</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">About ToolNest</h1>
          <p className="text-text-secondary text-lg">
            Your one-stop destination for free, fast, and powerful online tools.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Our Mission</h2>
            <p className="text-text-secondary">
              ToolNest was created with a simple mission: to make powerful online tools accessible to everyone, completely free. We believe that quality tools should not come with a price tag or require complicated sign-ups.
            </p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">What We Offer</h2>
            <p className="text-text-secondary mb-4">
              We provide a growing collection of online tools across multiple categories:
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span><strong className="text-text-primary">Image Tools</strong> - Compress, resize, and edit images</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span><strong className="text-text-primary">PDF Tools</strong> - Merge, split, and manage PDF files</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span><strong className="text-text-primary">Text Tools</strong> - Analyze and transform text</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span><strong className="text-text-primary">Developer Tools</strong> - Useful utilities for developers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span><strong className="text-text-primary">Utility Tools</strong> - Everyday useful utilities</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Why Choose ToolNest?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-xl">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="text-text-primary font-semibold mb-1">Fast & Free</h3>
                <p className="text-text-secondary text-sm">All tools are completely free with no hidden fees</p>
              </div>
              <div className="p-4 bg-surface rounded-xl">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="text-text-primary font-semibold mb-1">Privacy First</h3>
                <p className="text-text-secondary text-sm">Your data stays on your device, processed locally</p>
              </div>
              <div className="p-4 bg-surface rounded-xl">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-text-primary font-semibold mb-1">Easy to Use</h3>
                <p className="text-text-secondary text-sm">Simple, intuitive interface for everyone</p>
              </div>
              <div className="p-4 bg-surface rounded-xl">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="text-text-primary font-semibold mb-1">Works Everywhere</h3>
                <p className="text-text-secondary text-sm">Access on any device, no installation needed</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Contact Us</h2>
            <p className="text-text-secondary">
              Have suggestions for new tools or feedback on existing ones? We&apos;d love to hear from you! 
              Reach out to us at <a href="mailto:contact@toolnest.com" className="text-primary hover:underline">contact@toolnest.com</a>
            </p>
          </div>

          <div className="text-center py-8">
            <p className="text-text-secondary">
              © {new Date().getFullYear()} ToolNest. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}