import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ToolNest',
  description: 'ToolNest Privacy Policy - Learn how we protect your data and privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-text-secondary">
          <p>Last updated: {new Date().getFullYear()}</p>
          
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Data Collection</h2>
            <p>ToolNest does not collect, store, or process any personal information. All tools operate entirely in your browser - your data stays on your device.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Cookies</h2>
            <p>We do not use cookies. We do not track your browsing activity.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Third-Party Services</h2>
            <p>We use Google AdSense to display advertisements. Google may collect information about your visit to show relevant ads. Please refer to Google&apos;s Privacy Policy for more information.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Images and Media</h2>
            <p>When you use our image tools (Image Downloader, Image Compressor), images are processed locally in your browser and are never uploaded to our servers.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Children&apos;s Privacy</h2>
            <p>Our service is not intended for children under 13. We do not knowingly collect any information from children.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at contact@toolnest.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}