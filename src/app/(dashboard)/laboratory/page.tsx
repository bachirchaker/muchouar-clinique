"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";
import { Eye, Edit, AlertCircle, TestTube, CheckCircle } from "lucide-react";

export default function LaboratoryPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "ALL", label: "Tous" },
    { id: "REQUESTED", label: "Demandés" },
    { id: "SAMPLE_COLLECTION", label: "Prélèvement" },
    { id: "IN_PROGRESS", label: "En cours" },
    { id: "COMPLETED", label: "Terminés" },
    { id: "VALIDATED", label: "Validés" },
  ];

  useEffect(() => {
    fetchTests();
  }, [activeTab]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const url = activeTab === "ALL" ? "/api/laboratory" : `/api/laboratory?status=${activeTab}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setTests(data.data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des analyses");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: any = {
      REQUESTED: { label: "Demandé", color: "bg-gray-100 text-gray-800" },
      SAMPLE_COLLECTION: { label: "Prélèvement", color: "bg-blue-100 text-blue-800" },
      IN_PROGRESS: { label: "En cours", color: "bg-yellow-100 text-yellow-800" },
      COMPLETED: { label: "Terminé", color: "bg-green-100 text-green-800" },
      VALIDATED: { label: "Validé", color: "bg-emerald-100 text-emerald-800" },
    };
    const mapped = map[status] || map.REQUESTED;
    return <span className={`px-2 py-1 rounded text-xs font-medium ${mapped.color}`}>{mapped.label}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laboratoire</h1>
          <p className="text-gray-500 text-sm">Gestion des analyses médicales</p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600">
          <TestTube className="w-4 h-4 mr-2" />
          Nouvelle Analyse
        </Button>
      </div>

      <div className="border-b border-gray-200 flex overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeTab === tab.id ? "border-sky-500 text-sky-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : tests.length === 0 ? (
          <EmptyState title="Aucune analyse" description="Aucune analyse trouvée pour ce statut." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Examen</th>
                  <th className="py-3 px-4 font-semibold">Catégorie</th>
                  <th className="py-3 px-4 font-semibold">Urgence</th>
                  <th className="py-3 px-4 font-semibold">Statut</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tests.map(test => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(test.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium">{test.patient.firstName} {test.patient.lastName}</td>
                    <td className="py-3 px-4 text-sky-700 font-medium">{test.testName}</td>
                    <td className="py-3 px-4 text-gray-500">{test.category}</td>
                    <td className="py-3 px-4">
                      {test.isUrgent && <Badge variant="danger" className="bg-red-50 text-red-600 border-red-200"><AlertCircle className="w-3 h-3 mr-1 inline" />Urgent</Badge>}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(test.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/laboratory/${test.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-sky-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
