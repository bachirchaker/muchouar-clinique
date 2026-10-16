'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, MoreHorizontal, Eye, FileText, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Toutes');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Mock fetch
      const res = await fetch(`/api/invoices?status=${status}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [status, search]);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Payée': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Brouillon': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
      case 'Envoyées': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Partiellement': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Impayées': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'Annulée': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Facturation</h1>
        <Link 
          href="/invoices/new" 
          className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Facture
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Rechercher (N°, Patient)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-transparent pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
          />
        </div>
        
        <select 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-full sm:w-48 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
        >
          {['Toutes', 'Brouillon', 'Envoyées', 'Payées', 'Partiellement', 'Impayées', 'Annulée'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">N° Facture</th>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Montant</th>
                <th className="px-4 py-3 font-medium text-right">Payé</th>
                <th className="px-4 py-3 font-medium text-right">Reste</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">Chargement...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">Aucune facture trouvée</td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-sky-600 dark:text-sky-400">
                      <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{invoice.patient?.firstName} {invoice.patient?.lastName}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right font-medium">{invoice.patientAmount.toFixed(2)} MAD</td>
                    <td className="px-4 py-3 text-right text-slate-500">{invoice.paidAmount.toFixed(2)} MAD</td>
                    <td className="px-4 py-3 text-right font-medium text-rose-500">
                      {(invoice.patientAmount - invoice.paidAmount).toFixed(2)} MAD
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", getStatusColor(invoice.status))}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/invoices/${invoice.id}`} className="text-slate-400 hover:text-sky-500 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
