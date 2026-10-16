"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "react-hot-toast";
import { ArrowLeft, CheckCircle, FileText, AlertTriangle } from "lucide-react";

export default function LabTestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchTest();
  }, [id]);

  const fetchTest = async () => {
    try {
      const res = await fetch(`/api/laboratory/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTest(data.data);
      } else {
        toast.error("Erreur de chargement");
      }
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/laboratory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Statut mis à jour");
        fetchTest();
      } else {
        toast.error("Erreur de mise à jour");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-6"><Skeleton className="h-40 w-full mb-6" /><Skeleton className="h-64 w-full" /></div>;
  if (!test) return <div className="p-6"><EmptyState title="Introuvable" description="Analyse non trouvée." /></div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/laboratory">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Détails de l'analyse</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-sky-800">{test.testName}</h2>
                <p className="text-gray-500 text-sm mt-1">{test.category} • {new Date(test.createdAt).toLocaleString()}</p>
              </div>
              <Badge variant={test.isUrgent ? "danger" : "secondary"}>
                {test.isUrgent ? "Urgent" : "Normal"}
              </Badge>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Résultats
              </h3>
              {(!test.results || test.results.length === 0) ? (
                <EmptyState title="En attente de résultats" description="Les résultats n'ont pas encore été saisis." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="py-2 px-3 text-left">Paramètre</th>
                        <th className="py-2 px-3 text-left">Valeur</th>
                        <th className="py-2 px-3 text-left">Unité</th>
                        <th className="py-2 px-3 text-left">Référence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {test.results.map((r: any) => (
                        <tr key={r.id}>
                          <td className="py-3 px-3 font-medium">{r.parameterName}</td>
                          <td className="py-3 px-3">
                            <span className={`font-semibold ${r.isAbnormal ? "text-red-600" : "text-gray-900"}`}>
                              {r.value}
                            </span>
                            {r.isAbnormal && <AlertTriangle className="w-4 h-4 text-red-500 inline ml-2" />}
                          </td>
                          <td className="py-3 px-3 text-gray-500">{r.unit}</td>
                          <td className="py-3 px-3 text-gray-500 text-xs">{r.referenceRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Patient</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                {test.patient.firstName[0]}{test.patient.lastName[0]}
              </div>
              <div>
                <Link href={`/patients/${test.patientId}`} className="font-medium text-sky-600 hover:underline">
                  {test.patient.firstName} {test.patient.lastName}
                </Link>
                <p className="text-xs text-gray-500">{test.patient.patientNumber}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t text-sm">
              <p><span className="text-gray-500">Médecin:</span> Dr. {test.doctor.user.lastName}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions & Statut</h3>
            <p className="text-sm font-medium mb-4 text-gray-700">Statut actuel: <span className="font-bold text-sky-700">{test.status}</span></p>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant={test.status === "REQUESTED" ? "default" : "outline"}
                disabled={isUpdating}
                onClick={() => updateStatus("SAMPLE_COLLECTION")}
              >
                1. Collecter échantillon
              </Button>
              <Button 
                className="w-full justify-start" 
                variant={test.status === "SAMPLE_COLLECTION" ? "default" : "outline"}
                disabled={isUpdating}
                onClick={() => updateStatus("IN_PROGRESS")}
              >
                2. Marquer en cours
              </Button>
              {test.status === "IN_PROGRESS" && (
                <Button className="w-full justify-start bg-amber-500 hover:bg-amber-600 text-white border-0">
                  3. Saisir résultats (Ouvrir form)
                </Button>
              )}
              <Button 
                className="w-full justify-start bg-green-500 hover:bg-green-600 text-white border-0" 
                disabled={isUpdating || test.status !== "COMPLETED"}
                onClick={() => updateStatus("VALIDATED")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                4. Valider résultats
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
