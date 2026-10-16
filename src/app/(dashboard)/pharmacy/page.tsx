"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Plus, Search } from "lucide-react";

export default function PharmacyPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory?category=medication");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pharmacie</h1>
        <Link href="/inventory/new" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Médicament
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700">
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">Quantité</th>
                <th className="p-4 font-medium">Unité</th>
                <th className="p-4 font-medium">Date exp.</th>
                <th className="p-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">Chargement...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-gray-500">Aucun médicament trouvé</td></tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id} className="border-b dark:border-gray-800">
                    <td className="p-4 font-medium dark:text-white">{item.name}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.unit}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      {item.quantity <= item.minQuantity && (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      )}
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
