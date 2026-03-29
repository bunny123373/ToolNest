'use client';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  items?: NavItem[];
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#6366f1' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#6366f1' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#6366f1' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
);

const defaultItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon active={false} /> },
  { id: 'search', label: 'Search', icon: <SearchIcon active={false} /> },
  { id: 'profile', label: 'Profile', icon: <ProfileIcon active={false} /> },
];

export default function BottomNav({ 
  activeTab, 
  onTabChange,
  items = defaultItems 
}: BottomNavProps) {
  const getIcon = (id: string, isActive: boolean) => {
    switch (id) {
      case 'home':
        return <HomeIcon active={isActive} />;
      case 'search':
        return <SearchIcon active={isActive} />;
      case 'profile':
        return <ProfileIcon active={isActive} />;
      default:
        return null;
    }
  };

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{getIcon(item.id, isActive)}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
