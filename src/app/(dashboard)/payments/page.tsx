'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('Tous');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments?method=${method}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [method]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <select 
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="h-10 w-full sm:w-48 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
        >
          {['Tous', 'Espèces', 'Carte Bancaire', 'Chèque', 'Virement'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        
        <div className="h-10 w-full sm:w-64 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm flex items-center text-slate-500 dark:border-slate-700">
          <span>Toutes les dates</span>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Facture</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium text-right">Montant</th>
              <th className="px-4 py-3 font-medium">Méthode</th>
              <th className="px-4 py-3 font-medium">Reçu par</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Chargement...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Aucun paiement trouvé</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-sky-600 dark:text-sky-400">
                    <Link href={`/invoices/${payment.invoiceId}`}>{payment.invoice?.invoiceNumber}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{payment.invoice?.patient?.firstName} {payment.invoice?.patient?.lastName}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">{payment.amount.toFixed(2)} MAD</td>
                  <td className="px-4 py-3 text-slate-500">{payment.method}</td>
                  <td className="px-4 py-3 text-slate-500">{payment.receivedBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
