"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function MaintenancePage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    let url = "/api/maintenance";
    if (filter !== "all") url += `?status=${filter}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Maintenance</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Ticket
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex space-x-4 overflow-x-auto">
          {[
            { id: "all", label: "Tous" },
            { id: "OPEN", label: "Ouverts" },
            { id: "IN_PROGRESS", label: "En cours" },
            { id: "ON_HOLD", label: "En attente" },
            { id: "COMPLETED", label: "Terminés" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filter === tab.id ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700">
                <th className="p-4 font-medium">N° Ticket</th>
                <th className="p-4 font-medium">Titre</th>
                <th className="p-4 font-medium">Catégorie</th>
                <th className="p-4 font-medium">Priorité</th>
                <th className="p-4 font-medium">Lieu</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Chargement...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Aucun ticket trouvé</td></tr>
              ) : (
                tickets.map((t: any) => (
                  <tr key={t.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium dark:text-white">{t.ticketNumber}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{t.title}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{t.category}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{t.priority}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{t.location}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{t.status}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(t.reportedAt).toLocaleDateString()}
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
