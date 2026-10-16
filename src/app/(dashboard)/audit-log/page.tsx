'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ScrollText, Filter, Download, User, Clock,
  LogIn, LogOut, Plus, Edit, Trash2, Eye, FileDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';

interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  module: string;
  entityId?: string;
  entityType?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

const ACTION_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'default'; icon: React.ReactNode }> = {
  CREATE: { label: 'Création', color: 'success', icon: <Plus className="h-3 w-3" /> },
  UPDATE: { label: 'Modification', color: 'warning', icon: <Edit className="h-3 w-3" /> },
  DELETE: { label: 'Suppression', color: 'danger', icon: <Trash2 className="h-3 w-3" /> },
  LOGIN: { label: 'Connexion', color: 'info', icon: <LogIn className="h-3 w-3" /> },
  LOGOUT: { label: 'Déconnexion', color: 'default', icon: <LogOut className="h-3 w-3" /> },
  VIEW: { label: 'Consultation', color: 'primary', icon: <Eye className="h-3 w-3" /> },
  EXPORT: { label: 'Export', color: 'info', icon: <FileDown className="h-3 w-3" /> },
  PAYMENT: { label: 'Paiement', color: 'success', icon: <Plus className="h-3 w-3" /> },
  PRESCRIPTION: { label: 'Prescription', color: 'primary', icon: <Plus className="h-3 w-3" /> },
  STATUS_CHANGE: { label: 'Changement statut', color: 'warning', icon: <Edit className="h-3 w-3" /> },
};

const MODULE_LABELS: Record<string, string> = {
  patients: 'Patients',
  appointments: 'Rendez-vous',
  consultations: 'Consultations',
  prescriptions: 'Prescriptions',
  invoices: 'Facturation',
  payments: 'Paiements',
  users: 'Utilisateurs',
  employees: 'Personnel',
  inventory: 'Stock',
  laboratory: 'Laboratoire',
  cleaning: 'Nettoyage',
  maintenance: 'Maintenance',
  rooms: 'Chambres',
  auth: 'Authentification',
  settings: 'Paramètres',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (moduleFilter) params.set('module', moduleFilter);
      if (actionFilter) params.set('action', actionFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const res = await fetch(`/api/audit-logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data);
        setTotal(data.meta?.total ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, moduleFilter, actionFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-sky-600" />
          Journal d&apos;audit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Historique de toutes les actions effectuées dans le système
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              value={moduleFilter}
              onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
            >
              <option value="">Tous les modules</option>
              {Object.entries(MODULE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <Select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
            >
              <option value="">Toutes les actions</option>
              {Object.entries(ACTION_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </Select>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              label=""
              placeholder="Date début"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              label=""
              placeholder="Date fin"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} variant="rect" className="h-16 rounded-lg" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={<ScrollText className="h-12 w-12" />}
              title="Aucune entrée"
              description="Le journal d'audit est vide pour les filtres sélectionnés."
            />
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {logs.map((log) => {
                const config = ACTION_CONFIG[log.action] || {
                  label: log.action,
                  color: 'default' as const,
                  icon: null,
                };
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        config.color === 'success'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                          : config.color === 'warning'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                          : config.color === 'danger'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                          : config.color === 'info'
                          ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/30'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={config.color} size="xs">
                          {config.label}
                        </Badge>
                        <Badge variant="outline" size="xs">
                          {MODULE_LABELS[log.module] || log.module}
                        </Badge>
                        {log.entityType && (
                          <span className="text-xs text-slate-400">
                            {log.entityType} {log.entityId ? `#${log.entityId.substring(0, 8)}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {log.user && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user.firstName} {log.user.lastName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString('fr-FR')}
                        </span>
                        {log.ipAddress && (
                          <span className="text-slate-400">{log.ipAddress}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > pageSize && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={total}
        />
      )}
    </div>
  );
}
