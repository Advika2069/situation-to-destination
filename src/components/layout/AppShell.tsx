import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Map,
  Route,
  Utensils,
  Users,
  Wallet,
  Briefcase,
  Shield,
  Download,
  BarChart3,
  User,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  MapPin,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/plan', icon: Route, label: 'Plan' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/move', icon: MapPin, label: 'Transport' },
  { to: '/experiences', icon: Sparkles, label: 'Experiences' },
  { to: '/trips', icon: Briefcase, label: 'Trips' },
  { to: '/travel-together', icon: Users, label: 'Travel Together' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/safety', icon: Shield, label: 'Safety' },
  { to: '/offline', icon: Download, label: 'Offline' },
  { to: '/business', icon: Briefcase, label: 'Business' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen, darkMode, setDarkMode } = useAppStore();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center border-b border-border h-14', sidebarOpen ? 'px-4' : 'px-3 justify-center')}>
          {sidebarOpen ? (
            <NavLink to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
                T
              </div>
              <span className="text-sm font-semibold tracking-tight">TravelOS</span>
            </NavLink>
          ) : (
            <NavLink to="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
              T
            </NavLink>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    active
                      ? 'bg-foreground/5 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom controls */}
        <div className="border-t border-border p-3 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all w-full',
              !sidebarOpen && 'justify-center px-0'
            )}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {sidebarOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all w-full',
              !sidebarOpen && 'justify-center px-0'
            )}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between border-b border-border bg-card h-14 px-4 sticky top-0 z-40">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background text-[10px] font-bold">
              T
            </div>
            <span className="text-sm font-semibold">TravelOS</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
}

function MobileBottomNav() {
  const location = useLocation();
  const mobileItems = navItems.slice(0, 5); // First 5 items for mobile

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-xl z-50">
      <div className="flex items-center justify-around h-14">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-all',
                active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
