'use client';

import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Toutes');

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses?category=${category}`);
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dépenses</h1>
        <button 
          className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Dépense
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-full sm:w-48 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
        >
          {['Toutes', 'Équipement', 'Salaire', 'Maintenance', 'Loyer', 'Autre'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        {/* Mock date range filter */}
        <div className="h-10 w-full sm:w-64 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm flex items-center text-slate-500 dark:border-slate-700">
          <span>Ce mois (Avril 2024)</span>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium text-right">Montant</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Créé par</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Chargement...</td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucune dépense trouvée</td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium">{expense.description}</td>
                  <td className="px-4 py-3 text-slate-500">{expense.category}</td>
                  <td className="px-4 py-3 text-right font-medium">{expense.amount.toFixed(2)} MAD</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500">{expense.createdBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
