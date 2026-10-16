"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "supply",
    quantity: 0,
    minQuantity: 10,
    unit: "piece",
    purchasePrice: "",
    sellingPrice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity.toString()),
          minQuantity: parseInt(formData.minQuantity.toString()),
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
          sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : null,
        }),
      });
      if (res.ok) {
        router.push("/inventory");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Nouvel Article</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'article</label>
          <input required type="text" className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
            <select className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="medication">Médicament</option>
              <option value="consumable">Consommable</option>
              <option value="equipment">Équipement</option>
              <option value="hygiene">Hygiène</option>
              <option value="supply">Fourniture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unité</label>
            <input required type="text" placeholder="boîte, pièce, etc." className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité Initiale</label>
            <input required type="number" min="0" className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité Minimale (Alerte)</label>
            <input required type="number" min="0" className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={formData.minQuantity} onChange={(e) => setFormData({...formData, minQuantity: parseInt(e.target.value) || 0})} />
          </div>
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Annuler</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
