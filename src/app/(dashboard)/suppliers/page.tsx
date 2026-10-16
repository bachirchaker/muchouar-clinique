"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Fournisseurs</h1>
        <Link href="/suppliers/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Fournisseur
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700">
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Téléphone</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Ville</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">Chargement...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-500">Aucun fournisseur</td></tr>
              ) : (
                suppliers.map((s: any) => (
                  <tr key={s.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                    <td className="p-4 font-medium dark:text-white">{s.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{s.contactPerson || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{s.phone || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{s.email || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{s.city || '-'}</td>
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
