import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | ToolNest',
  description: 'ToolNest Disclaimer - Important information about our service.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Disclaimer</h1>
        
        <div className="space-y-6 text-text-secondary">
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">General Information</h2>
            <p>ToolNest provides online tools for educational and personal use. The information provided on this website is for general informational purposes only.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Accuracy</h2>
            <p>While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the information.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">User Responsibility</h2>
            <p>Users are responsible for how they use our tools. We are not responsible for any loss or damage resulting from the use of our tools.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Third-Party Content</h2>
            <p>Our website may contain links to third-party websites. We have no control over the content of those websites and accept no responsibility for them.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Downloads</h2>
            <p>When downloading content using our tools (such as YouTube thumbnails or images), ensure you have the right to download and use such content. We are not responsible for any copyright violations.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Changes to Disclaimer</h2>
            <p>We reserve the right to update this disclaimer at any time without notice. Your continued use of the website constitutes acceptance of these terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}