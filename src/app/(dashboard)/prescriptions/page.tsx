'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText, Plus, Eye, Printer, Filter, Pill,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Select } from '@/components/ui/select';

interface PrescriptionData {
  id: string;
  date: string;
  status: string;
  notes?: string;
  patient: { firstName: string; lastName: string; patientNumber: string };
  doctor: {
    specialty: string;
    employee: { firstName: string; lastName: string };
  };
  items: Array<{
    id: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  COMPLETED: { label: 'Terminée', variant: 'default' },
  CANCELLED: { label: 'Annulée', variant: 'danger' },
};

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrescriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/prescriptions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data.data);
        setTotal(data.meta?.total ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-600" />
            Prescriptions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gérer les ordonnances et prescriptions médicales
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                placeholder="Rechercher par patient..."
                value={search}
                onChange={setSearch}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">Tous les statuts</option>
              <option value="ACTIVE">Actives</option>
              <option value="COMPLETED">Terminées</option>
              <option value="CANCELLED">Annulées</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rect" className="h-24 rounded-lg" />
              ))}
            </div>
          ) : prescriptions.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-12 w-12" />}
              title="Aucune prescription"
              description="Les prescriptions apparaîtront ici après une consultation."
            />
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {prescriptions.map((rx) => {
                const statusConfig = STATUS_CONFIG[rx.status] || STATUS_CONFIG.ACTIVE;
                return (
                  <div
                    key={rx.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/prescriptions/${rx.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {rx.patient.firstName} {rx.patient.lastName}
                          </span>
                          <span className="text-xs text-slate-400">
                            {rx.patient.patientNumber}
                          </span>
                          <Badge variant={statusConfig.variant} size="xs">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Dr. {rx.doctor.employee.firstName} {rx.doctor.employee.lastName} — {rx.doctor.specialty}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {rx.items.slice(0, 3).map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs rounded-full"
                            >
                              <Pill className="h-3 w-3" />
                              {item.medicationName} — {item.dosage}
                            </span>
                          ))}
                          {rx.items.length > 3 && (
                            <span className="text-xs text-slate-400">
                              +{rx.items.length - 3} autres
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          {new Date(rx.date).toLocaleDateString('fr-FR')}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="xs">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="xs">
                            <Printer className="h-3.5 w-3.5" />
                          </Button>
                        </div>
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
