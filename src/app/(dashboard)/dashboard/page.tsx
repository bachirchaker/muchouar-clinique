'use client';

import { useEffect, useState } from 'react';
import {
  Users, Calendar, Stethoscope, DollarSign,
  UserCheck, Package, BedDouble, TrendingUp,
  TrendingDown, Clock, AlertTriangle, Activity,
  ArrowUpRight, ArrowDownRight, UserPlus, FileText,
  CreditCard, Pill, Sparkles, Wrench,
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface DashboardStats {
  patients: {
    today: number;
    newThisMonth: number;
    active: number;
    hospitalized: number;
    trend: number;
  };
  appointments: {
    today: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  consultations: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  finance: {
    revenue: number;
    payments: number;
    unpaidInvoices: number;
    expenses: number;
    profit: number;
  };
  staff: {
    presentToday: number;
    absent: number;
    doctorsAvailable: number;
    nursesAvailable: number;
  };
  inventory: {
    totalProducts: number;
    lowStock: number;
    expired: number;
    outOfStock: number;
  };
  rooms: {
    occupied: number;
    available: number;
    totalBeds: number;
    availableBeds: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'consultation' | 'payment' | 'patient' | 'lab';
  description: string;
  time: string;
  user: string;
}

interface UpcomingAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  time: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.data.stats);
        setRecentActivity(data.data.recentActivity);
        setUpcomingAppointments(data.data.upcomingAppointments);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const s = stats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Vue d&apos;ensemble de la clinique — {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Grid - Row 1: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Patients aujourd'hui"
          value={s?.patients.today ?? 0}
          change={s?.patients.trend ?? 0}
          trend={s?.patients.trend && s.patients.trend >= 0 ? 'up' : 'down'}
          color="primary"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Rendez-vous aujourd'hui"
          value={s?.appointments.today ?? 0}
          color="info"
        />
        <StatCard
          icon={<Stethoscope className="h-5 w-5" />}
          label="Consultations aujourd'hui"
          value={s?.consultations.today ?? 0}
          color="success"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Chiffre d'affaires"
          value={formatCurrency(s?.finance.revenue ?? 0)}
          change={12}
          trend="up"
          color="warning"
        />
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<UserPlus className="h-5 w-5" />}
          label="Nouveaux patients"
          value={s?.patients.newThisMonth ?? 0}
          subtitle="Ce mois"
          color="primary"
        />
        <StatCard
          icon={<BedDouble className="h-5 w-5" />}
          label="Patients hospitalisés"
          value={s?.patients.hospitalized ?? 0}
          color="danger"
        />
        <StatCard
          icon={<CreditCard className="h-5 w-5" />}
          label="Factures impayées"
          value={s?.finance.unpaidInvoices ?? 0}
          color="danger"
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5" />}
          label="Personnel présent"
          value={s?.staff.presentToday ?? 0}
          subtitle={`${s?.staff.absent ?? 0} absent(s)`}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
            <a
              href="/appointments"
              className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium"
            >
              Voir tout →
            </a>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Aucun rendez-vous à venir</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dr. {apt.doctorName} — {apt.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {apt.time}
                      </span>
                      <AppointmentStatusBadge status={apt.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistiques rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Doctors */}
            <QuickStatItem
              icon={<UserCheck className="h-4 w-4 text-sky-600" />}
              label="Médecins disponibles"
              value={s?.staff.doctorsAvailable ?? 0}
              color="sky"
            />
            {/* Nurses */}
            <QuickStatItem
              icon={<Activity className="h-4 w-4 text-teal-600" />}
              label="Infirmiers disponibles"
              value={s?.staff.nursesAvailable ?? 0}
              color="teal"
            />
            {/* Rooms */}
            <QuickStatItem
              icon={<BedDouble className="h-4 w-4 text-violet-600" />}
              label="Chambres libres"
              value={s?.rooms.available ?? 0}
              total={s ? s.rooms.available + s.rooms.occupied : 0}
              color="violet"
            />
            {/* Beds */}
            <QuickStatItem
              icon={<BedDouble className="h-4 w-4 text-emerald-600" />}
              label="Lits disponibles"
              value={s?.rooms.availableBeds ?? 0}
              total={s?.rooms.totalBeds ?? 0}
              color="emerald"
            />
            {/* Low Stock */}
            <QuickStatItem
              icon={<Package className="h-4 w-4 text-amber-600" />}
              label="Stock faible"
              value={s?.inventory.lowStock ?? 0}
              color="amber"
              alert={s ? s.inventory.lowStock > 0 : false}
            />
            {/* Expired */}
            <QuickStatItem
              icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
              label="Produits expirés"
              value={s?.inventory.expired ?? 0}
              color="red"
              alert={s ? s.inventory.expired > 0 : false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Finance & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Finances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FinanceItem
              label="Revenus"
              amount={s?.finance.revenue ?? 0}
              icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
              color="emerald"
            />
            <FinanceItem
              label="Paiements reçus"
              amount={s?.finance.payments ?? 0}
              icon={<CreditCard className="h-4 w-4 text-sky-500" />}
              color="sky"
            />
            <FinanceItem
              label="Dépenses"
              amount={s?.finance.expenses ?? 0}
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              color="red"
            />
            <div className="border-t pt-3 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Bénéfice
                </span>
                <span
                  className={`font-bold text-lg ${
                    (s?.finance.profit ?? 0) >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(s?.finance.profit ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Activité récente</CardTitle>
            <a
              href="/audit-log"
              className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium"
            >
              Journal complet →
            </a>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Activity className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activity.user} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Appointments Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MiniStatCard
          label="Confirmés"
          value={s?.appointments.today ?? 0}
          color="bg-sky-500"
        />
        <MiniStatCard
          label="En attente"
          value={s?.appointments.upcoming ?? 0}
          color="bg-amber-500"
        />
        <MiniStatCard
          label="Terminés"
          value={s?.appointments.completed ?? 0}
          color="bg-emerald-500"
        />
        <MiniStatCard
          label="Annulés"
          value={s?.appointments.cancelled ?? 0}
          color="bg-red-500"
        />
        <MiniStatCard
          label="Absents"
          value={s?.appointments.noShow ?? 0}
          color="bg-slate-500"
        />
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

function AppointmentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
    PENDING: { label: 'En attente', variant: 'warning' },
    CONFIRMED: { label: 'Confirmé', variant: 'info' },
    ARRIVED: { label: 'Arrivé', variant: 'success' },
    IN_CONSULTATION: { label: 'En consultation', variant: 'info' },
    COMPLETED: { label: 'Terminé', variant: 'success' },
    CANCELLED: { label: 'Annulé', variant: 'danger' },
    NO_SHOW: { label: 'Absent', variant: 'default' },
  };
  const c = config[status] || { label: status, variant: 'default' as const };
  return <Badge variant={c.variant} size="sm">{c.label}</Badge>;
}

function QuickStatItem({
  icon,
  label,
  value,
  total,
  color,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center bg-${color}-50 dark:bg-${color}-900/20`}
        >
          {icon}
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`font-semibold text-sm ${
            alert ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
          }`}
        >
          {value}
        </span>
        {total !== undefined && (
          <span className="text-xs text-slate-400">/{total}</span>
        )}
      </div>
    </div>
  );
}

function FinanceItem({
  label,
  amount,
  icon,
  color,
}: {
  label: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <span className="font-medium text-sm text-slate-900 dark:text-white">
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    appointment: (
      <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
        <Calendar className="h-4 w-4 text-sky-600" />
      </div>
    ),
    consultation: (
      <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
        <Stethoscope className="h-4 w-4 text-teal-600" />
      </div>
    ),
    payment: (
      <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <CreditCard className="h-4 w-4 text-emerald-600" />
      </div>
    ),
    patient: (
      <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
        <UserPlus className="h-4 w-4 text-violet-600" />
      </div>
    ),
    lab: (
      <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <FileText className="h-4 w-4 text-amber-600" />
      </div>
    ),
  };
  return icons[type] || icons.patient;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="text" className="h-4 w-72 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rect" className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rect" className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton variant="rect" className="h-80 rounded-xl lg:col-span-2" />
        <Skeleton variant="rect" className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

// ============================================
// Utilities
// ============================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
