import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ToolNest',
  description: 'ToolNest Terms of Service - Read our terms and conditions.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-text-secondary">
          <p>Last updated: {new Date().getFullYear()}</p>
          
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Acceptance of Terms</h2>
            <p>By accessing and using ToolNest, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Use License</h2>
            <p>Permission is granted to temporarily use ToolNest for personal, non-commercial use only. This is the grant of a license, not a transfer of title.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Disclaimer</h2>
            <p>The tools provided on ToolNest are provided &quot;as is&quot;. We make no warranties, expressed or implied, and hereby disclaim all warranties including implied warranties of merchantability or fitness for a particular purpose.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Limitations</h2>
            <p>We shall not be liable for any damages arising out of the use or inability to use the materials on ToolNest, even if we have been notified of the possibility of such damage.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Accuracy of Materials</h2>
            <p>The materials appearing on ToolNest could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate or complete.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Links</h2>
            <p>ToolNest has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site.</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Modifications</h2>
            <p>We may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by these terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}