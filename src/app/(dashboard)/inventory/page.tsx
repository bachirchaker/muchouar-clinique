"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Plus, Search, ArrowRightLeft } from "lucide-react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [filter, search]);

  const fetchItems = async () => {
    setLoading(true);
    let url = "/api/inventory?";
    if (search) url += `search=${search}&`;
    if (filter === "lowStock") url += "lowStock=true&";
    if (filter === "expired") url += "expired=true&";
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item: any) => {
    if (filter === "outOfStock") return item.quantity === 0;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Inventaire & Stock</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center dark:bg-gray-800 dark:text-gray-300">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Mouvement
          </button>
          <Link href="/inventory/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Article
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex space-x-4">
            {["all", "lowStock", "expired", "outOfStock"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-full text-sm ${filter === tab ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                {tab === "all" ? "Tous" : tab === "lowStock" ? "Stock faible" : tab === "expired" ? "Expirés" : "Rupture"}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700">
                <th className="p-4 font-medium">Nom</th>
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Quantité</th>
                <th className="p-4 font-medium">Unité</th>
                <th className="p-4 font-medium">Prix</th>
                <th className="p-4 font-medium">Date exp.</th>
                <th className="p-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Chargement...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Aucun article trouvé</td></tr>
              ) : (
                filteredItems.map((item: any) => (
                  <tr key={item.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium dark:text-white">{item.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.category}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium dark:text-gray-200">{item.quantity}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.quantity === 0 ? 'bg-red-500' : item.quantity <= item.minQuantity ? 'bg-orange-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(100, (item.quantity / (item.minQuantity * 3)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.unit}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{item.sellingPrice || item.purchasePrice || '-'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      {item.quantity === 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Rupture</span>
                      ) : item.quantity <= item.minQuantity ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">Faible</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Normal</span>
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
