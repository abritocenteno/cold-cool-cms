import React from 'react';
import { LayoutDashboard, Car, FileText, Video, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cars', label: 'Cars', icon: Car },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Video },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-brand-bg)] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-brand-border)] flex flex-col glass">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-[var(--color-brand-accent)] neon-glow font-display">OLD COOL CMS</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-brand-border)] space-y-2">
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <div className="nav-item text-red-400">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};
