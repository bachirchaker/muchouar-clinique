'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      patientId: '',
      notes: '',
      discount: 0,
      taxRate: 0,
      insuranceCoverage: 0,
      items: [{ description: '', category: 'Consultation', quantity: 1, unitPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const watchItems = watch('items');
  const watchDiscount = watch('discount');
  const watchTaxRate = watch('taxRate');
  const watchInsurance = watch('insuranceCoverage');

  const subtotal = watchItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalAfterDiscount = subtotal - watchDiscount;
  const taxAmount = totalAfterDiscount * (watchTaxRate / 100);
  const total = totalAfterDiscount + taxAmount;
  const amountDue = total - watchInsurance;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        router.push(`/invoices/${result.data.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle Facture</h1>
        <p className="text-slate-500">Créez une nouvelle facture pour un patient</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Patient</label>
            <select 
              {...register('patientId', { required: true })}
              className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
            >
              <option value="">Sélectionner un patient...</option>
              {/* Dummy patients for now */}
              <option value="1">Jean Dupont</option>
              <option value="2">Marie Martin</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Lignes de facturation</h2>
          </div>

          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="flex-1 space-y-1">
                  <input
                    {...register(`items.${index}.description` as const, { required: true })}
                    placeholder="Description"
                    className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
                  />
                </div>
                <div className="w-32 space-y-1">
                  <select
                    {...register(`items.${index}.category` as const)}
                    className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Examen">Examen</option>
                    <option value="Chambre">Chambre</option>
                    <option value="Médicament">Médicament</option>
                  </select>
                </div>
                <div className="w-24 space-y-1">
                  <input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    placeholder="Qté"
                    className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
                  />
                </div>
                <div className="w-32 space-y-1">
                  <input
                    type="number"
                    min="0"
                    {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                    placeholder="Prix U."
                    className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
                  />
                </div>
                <div className="pt-2">
                  <button type="button" onClick={() => remove(index)} className="text-rose-500 hover:text-rose-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ description: '', category: 'Consultation', quantity: 1, unitPrice: 0 })}
            className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une ligne
          </button>
        </div>

        <div className="flex justify-end">
          <div className="w-80 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Sous-total</span>
              <span className="font-medium">{subtotal.toFixed(2)} MAD</span>
            </div>
            
            <div className="flex justify-between text-sm items-center">
              <span className="text-slate-500">Remise (MAD)</span>
              <input
                type="number"
                {...register('discount', { valueAsNumber: true })}
                className="w-24 rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-between text-sm items-center">
              <span className="text-slate-500">TVA (%)</span>
              <input
                type="number"
                {...register('taxRate', { valueAsNumber: true })}
                className="w-24 rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-between text-sm items-center">
              <span className="text-slate-500">Couverture Ass.</span>
              <input
                type="number"
                {...register('insuranceCoverage', { valueAsNumber: true })}
                className="w-24 rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between">
              <span className="font-semibold text-lg">Total à payer</span>
              <span className="font-bold text-lg text-sky-600 dark:text-sky-400">{amountDue.toFixed(2)} MAD</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-md bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer la facture'}
          </button>
        </div>
      </form>
    </div>
  );
}
