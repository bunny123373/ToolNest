import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | ToolNest',
  description: 'Contact ToolNest - Get in touch with us.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
          <p className="text-text-secondary">Have questions or suggestions? We&apos;d love to hear from you!</p>
        </div>
        
        <div className="bg-surface-elevated border border-border rounded-2xl p-8">
          <div className="space-y-6 text-text-secondary">
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Email</h2>
              <p>For general inquiries: <a href="mailto:contact@toolnest.com" className="text-primary hover:underline">contact@toolnest.com</a></p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Response Time</h2>
              <p>We typically respond within 24-48 hours.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-text-primary mb-2">What you can contact us about</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Bug reports or technical issues</li>
                <li>Suggestions for new tools</li>
                <li>Partnership opportunities</li>
                <li>General questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}