"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSupplierPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/suppliers");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Nouveau Fournisseur</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
          <input required type="text" className="w-full border p-2 rounded dark:bg-gray-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Personne de contact</label>
            <input type="text" className="w-full border p-2 rounded dark:bg-gray-800" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input type="text" className="w-full border p-2 rounded dark:bg-gray-800" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border p-2 rounded dark:bg-gray-800" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded text-gray-600">Annuler</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
