'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, Send, CreditCard, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for now
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setInvoice(data.data);
        } else {
          router.push('/invoices');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [params.id, router]);

  if (loading) return <div>Chargement de la facture...</div>;
  if (!invoice) return <div>Facture introuvable.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facture {invoice.invoiceNumber}</h1>
          <p className="text-slate-500">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Send className="mr-2 h-4 w-4" /> Envoyer
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-emerald-500 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-600">
            <CreditCard className="mr-2 h-4 w-4" /> Encaisser
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-rose-50 text-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50">
            <Ban className="mr-2 h-4 w-4" /> Annuler
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Informations Patient</h3>
          <p className="font-medium">{invoice.patient?.firstName} {invoice.patient?.lastName}</p>
          <p className="text-sm text-slate-500">ID Patient: {invoice.patientId}</p>
          <p className="text-sm text-slate-500 mt-2">Email: {invoice.patient?.email}</p>
          <p className="text-sm text-slate-500">Tél: {invoice.patient?.phone}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Détails Facture</h3>
            <p className="text-sm">Statut: <span className="font-semibold">{invoice.status}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Reste à payer</p>
            <p className="text-3xl font-bold text-rose-500">{(invoice.patientAmount - invoice.paidAmount).toFixed(2)} MAD</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Catégorie</th>
              <th className="px-6 py-3 font-medium text-right">Qté</th>
              <th className="px-6 py-3 font-medium text-right">Prix Unitaire</th>
              <th className="px-6 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4 text-slate-500">{item.category}</td>
                <td className="px-6 py-4 text-right">{item.quantity}</td>
                <td className="px-6 py-4 text-right">{item.unitPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-right font-medium">{item.total.toFixed(2)} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-80 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Sous-total</span>
            <span>{invoice.subtotal.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Remise</span>
            <span>- {invoice.discountAmount.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TVA</span>
            <span>+ {invoice.taxAmount.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Couverture Assurance</span>
            <span className="text-emerald-500">- {invoice.insuranceCoverage.toFixed(2)} MAD</span>
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-lg">
            <span>Total Patient</span>
            <span>{invoice.patientAmount.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Déjà payé</span>
            <span>{invoice.paidAmount.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
