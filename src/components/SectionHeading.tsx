interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`mb-8 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary">{subtitle}</p>
      )}
    </div>
  );
}