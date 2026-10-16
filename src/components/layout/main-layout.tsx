'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { useSidebarStore } from '@/store/sidebar-store';
import { cn } from '@/lib/utils';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-50">
      <Sidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "md:ml-[80px]" : "md:ml-[280px]"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
