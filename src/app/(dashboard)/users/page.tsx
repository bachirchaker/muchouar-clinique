'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserPlus, MoreVertical, Shield, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserInput } from '@/lib/validations';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  DOCTOR: 'Médecin',
  NURSE: 'Infirmier(e)',
  RECEPTIONIST: 'Réceptionniste',
  ACCOUNTANT: 'Comptable',
  PHARMACIST: 'Pharmacien(ne)',
  LAB_TECHNICIAN: 'Technicien labo',
  CLEANER: 'Agent de nettoyage',
  MAINTENANCE: 'Agent de maintenance',
  MANAGER: 'Directeur',
};

const ROLE_COLORS: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  ADMIN: 'danger',
  DOCTOR: 'primary',
  NURSE: 'success',
  RECEPTIONIST: 'info',
  ACCOUNTANT: 'warning',
  PHARMACIST: 'success',
  LAB_TECHNICIAN: 'info',
  CLEANER: 'default',
  MAINTENANCE: 'default',
  MANAGER: 'warning',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);

      const res = await fetch(`/api/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
        setTotal(data.meta?.total ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowCreateModal(false);
        reset();
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Erreur');
      }
    } catch {
      alert('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Utilisateurs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gérer les comptes utilisateurs et les accès
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} icon={<UserPlus className="h-4 w-4" />}>
          Nouvel utilisateur
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={setSearch}
              />
            </div>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Tous les rôles</option>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rect" className="h-14 rounded-lg" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<UserPlus className="h-12 w-12" />}
              title="Aucun utilisateur"
              description="Commencez par créer un premier utilisateur."
              action={
                <Button onClick={() => setShowCreateModal(true)}>
                  Créer un utilisateur
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${user.firstName} ${user.lastName}`}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.phone && (
                              <p className="text-xs text-slate-500">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ROLE_COLORS[user.role] || 'default'} size="sm">
                          {ROLE_LABELS[user.role] || user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={user.isActive ? 'success' : 'danger'}
                          size="sm"
                        >
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString('fr-FR')
                          : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nouvel utilisateur"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Nom"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Mot de passe"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Téléphone"
            {...register('phone')}
          />
          <Select
            label="Rôle"
            {...register('role')}
            error={errors.role?.message}
          >
            <option value="">Sélectionner un rôle</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Annuler
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Créer l&apos;utilisateur
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
