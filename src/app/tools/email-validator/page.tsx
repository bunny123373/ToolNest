import type { Metadata } from 'next';
import ToolPageClient from './ToolPageClient';

export const metadata: Metadata = {
  title: 'Email Validator | ToolNest',
  description: 'Validate email addresses instantly. Check email format, MX records suggestion, and more.',
  keywords: 'email validator, email checker, validate email, email format checker',
};

export default async function EmailValidatorPage() {
  return <ToolPageClient />;
}
