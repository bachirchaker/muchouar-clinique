'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebar-store';
import {
  Cross,
  LayoutDashboard, Calendar, Users, Stethoscope,
  FolderHeart, FileText, TestTube, ScanLine, BedDouble, DoorOpen,
  UserCog, UserCheck, HeartPulse, CalendarDays, CalendarOff, Clock,
  Receipt, CreditCard, Wallet, Shield, TrendingDown, Calculator,
  Pill, Package, Truck, ShoppingCart, Wrench, Sparkles,
  FileBarChart, BarChart3, Activity,
  UserPlus, Lock, ScrollText, Settings,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const MENU_GROUPS = [
  {
    label: 'PRINCIPAL',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Agenda', icon: Calendar, href: '/appointments' },
      { label: 'Patients', icon: Users, href: '/patients' },
      { label: 'Consultations', icon: Stethoscope, href: '/consultations' },
    ]
  },
  {
    label: 'MÉDICAL',
    items: [
      { label: 'Dossiers médicaux', icon: FolderHeart, href: '/medical-records' },
      { label: 'Prescriptions', icon: FileText, href: '/prescriptions' },
      { label: 'Examens', icon: TestTube, href: '/laboratory' },
      { label: 'Imagerie', icon: ScanLine, href: '/imaging' },
      { label: 'Hospitalisation', icon: BedDouble, href: '/hospitalization' },
      { label: 'Chambres & Lits', icon: DoorOpen, href: '/rooms' },
    ]
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Personnel', icon: UserCog, href: '/employees' },
      { label: 'Médecins', icon: UserCheck, href: '/doctors' },
      { label: 'Infirmiers', icon: HeartPulse, href: '/nurses' },
      { label: 'Planning', icon: CalendarDays, href: '/planning' },
      { label: 'Congés', icon: CalendarOff, href: '/leaves' },
      { label: 'Présence', icon: Clock, href: '/attendance' },
    ]
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Facturation', icon: Receipt, href: '/invoices' },
      { label: 'Paiements', icon: CreditCard, href: '/payments' },
      { label: 'Caisse', icon: Wallet, href: '/cash-register' },
      { label: 'Assurances', icon: Shield, href: '/insurance' },
      { label: 'Dépenses', icon: TrendingDown, href: '/expenses' },
      { label: 'Comptabilité', icon: Calculator, href: '/accounting' },
    ]
  },
  {
    label: 'LOGISTIQUE',
    items: [
      { label: 'Pharmacie', icon: Pill, href: '/pharmacy' },
      { label: 'Stock', icon: Package, href: '/inventory' },
      { label: 'Fournisseurs', icon: Truck, href: '/suppliers' },
      { label: 'Achats', icon: ShoppingCart, href: '/purchases' },
      { label: 'Maintenance', icon: Wrench, href: '/maintenance' },
      { label: 'Nettoyage', icon: Sparkles, href: '/cleaning' },
    ]
  },
  {
    label: 'ANALYTICS',
    items: [
      { label: 'Rapports', icon: FileBarChart, href: '/reports' },
      { label: 'Statistiques', icon: BarChart3, href: '/statistics' },
      { label: 'Performance', icon: Activity, href: '/performance' },
    ]
  },
  {
    label: 'SYSTÈME',
    items: [
      { label: 'Utilisateurs', icon: UserPlus, href: '/users' },
      { label: 'Rôles & Permissions', icon: Lock, href: '/roles' },
      { label: "Journal d'audit", icon: ScrollText, href: '/audit-log' },
      { label: 'Paramètres', icon: Settings, href: '/settings' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle, isMobileOpen, closeMobile } = useSidebarStore();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white">
              <Cross className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg whitespace-nowrap text-slate-900 dark:text-white">
                MUCHOUAR CLINIQUE
              </span>
            )}
          </div>
          <button
            onClick={toggle}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="space-y-6">
            {MENU_GROUPS.map((group, i) => (
              <div key={i} className="px-3">
                {!isCollapsed && (
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {group.label}
                  </h3>
                )}
                {isCollapsed && (
                  <div className="mb-2 flex justify-center">
                    <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item, j) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={j}
                        href={item.href}
                        onClick={() => closeMobile()}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
                          isActive 
                            ? "bg-sky-500 text-white" 
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                          isCollapsed && "justify-center px-0"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0", isCollapsed ? "mx-auto" : "")} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Info Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-slate-900 dark:text-white">Admin User</span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">Administrateur</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
