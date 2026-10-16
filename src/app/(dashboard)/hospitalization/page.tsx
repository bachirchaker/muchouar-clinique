"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function HospitalizationPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hospitalization?status=ADMITTED");
      const data = await res.json();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hospitalisation</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Admission
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700">
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Chambre / Lit</th>
                <th className="p-4 font-medium">Médecin</th>
                <th className="p-4 font-medium">Date admission</th>
                <th className="p-4 font-medium">Sortie prévue</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center">Chargement...</td></tr>
              ) : admissions.length === 0 ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Aucun patient hospitalisé</td></tr>
              ) : (
                admissions.map((adm: any) => (
                  <tr key={adm.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium dark:text-white">
                      {adm.patient?.firstName} {adm.patient?.lastName}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Ch. {adm.bed?.room?.roomNumber} - Lit {adm.bed?.bedNumber}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      Dr. {adm.doctor?.employee?.lastName}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(adm.admissionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {adm.expectedDischargeDate ? new Date(adm.expectedDischargeDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {adm.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:underline mr-3 text-sm">Transférer</button>
                      <button className="text-red-600 hover:underline text-sm">Sortie</button>
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
