'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar-store';
import { useThemeStore } from '@/store/theme-store';

export function Header() {
  const pathname = usePathname();
  const { toggleMobile } = useSidebarStore();
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPath = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobile}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">
          {currentPath.replace('-', ' ')}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:justify-between px-4">
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-12 text-sm text-slate-900 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <div className="absolute right-3 flex items-center">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-medium text-white cursor-pointer hover:bg-sky-600 transition-colors">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
