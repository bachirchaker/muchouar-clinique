"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function CleaningPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    let url = "/api/cleaning";
    if (filter !== "all") url += `?status=${filter}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Nettoyage & Hygiène</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Tâche
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex space-x-4 overflow-x-auto">
          {[
            { id: "all", label: "Toutes" },
            { id: "TODO", label: "À faire" },
            { id: "IN_PROGRESS", label: "En cours" },
            { id: "COMPLETED", label: "Terminées" },
            { id: "VERIFIED", label: "Vérifiées" }
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
                <th className="p-4 font-medium">Zone</th>
                <th className="p-4 font-medium">Lieu</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Assigné à</th>
                <th className="p-4 font-medium">Priorité</th>
                <th className="p-4 font-medium">Date prévue</th>
                <th className="p-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Chargement...</td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Aucune tâche trouvée</td></tr>
              ) : (
                tasks.map((task: any) => (
                  <tr key={task.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium dark:text-white">{task.zone}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{task.location}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{task.taskType}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{task.assignedTo?.firstName || '-'} {task.assignedTo?.lastName || ''}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(task.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{task.status}</td>
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
