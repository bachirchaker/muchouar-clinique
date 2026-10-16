"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowLeft, Edit, Printer, MoreVertical, Calendar, Phone, Mail, MapPin, Activity, Droplets } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPatient(data.data);
      } else {
        toast.error(data.message || "Erreur de chargement");
        router.push("/patients");
      }
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "-";
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970) + " ans";
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "consultations", label: "Consultations" },
    { id: "appointments", label: "Rendez-vous" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "documents", label: "Documents" },
    { id: "invoices", label: "Factures" },
  ];

  if (loading) {
    return <div className="p-6 space-y-6"><Skeleton className="h-40 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!patient) return null;

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-3xl shadow-sm border-2 border-white">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
              <Badge variant={patient.isActive ? "success" : "danger"}>{patient.isActive ? "Actif" : "Inactif"}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-sky-600">{patient.patientNumber}</span>
              <span>•</span>
              <span>{calculateAge(patient.dateOfBirth)}</span>
              <span>•</span>
              <span>{patient.gender === "MALE" ? "Homme" : "Femme"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href={`/patients/${patient.id}/edit`}>
            <Button variant="outline" className="flex-1 md:flex-none">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button variant="outline">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? "border-sky-500 text-sky-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informations Personnelles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div><span className="text-gray-500 block">Téléphone</span><span className="font-medium">{patient.phone || "-"}</span></div>
                  <div><span className="text-gray-500 block">Email</span><span className="font-medium">{patient.email || "-"}</span></div>
                  <div><span className="text-gray-500 block">Date de naissance</span><span className="font-medium">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "-"}</span></div>
                  <div><span className="text-gray-500 block">Profession</span><span className="font-medium">{patient.profession || "-"}</span></div>
                  <div className="sm:col-span-2"><span className="text-gray-500 block">Adresse</span><span className="font-medium">{patient.address || "-"}, {patient.city || "-"}</span></div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-red-600">Informations Médicales Importantes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="text-gray-500 block flex items-center gap-1"><Droplets className="w-4 h-4" /> Groupe Sanguin</span>
                    <span className="font-bold text-red-600 text-lg mt-1 block">{patient.bloodGroup || "Non spécifié"}</span>
                  </div>
                  <div><span className="text-gray-500 block">Allergies</span><span className="font-medium text-orange-600">{patient.allergies || "Aucune connue"}</span></div>
                  <div className="sm:col-span-2"><span className="text-gray-500 block">Maladies chroniques</span><span className="font-medium">{patient.chronicDiseases || "Aucune"}</span></div>
                  <div className="sm:col-span-2"><span className="text-gray-500 block">Médicaments actuels</span><span className="font-medium">{patient.currentMedications || "Aucun"}</span></div>
                </div>
              </Card>
            </div>

            {/* Right Col */}
            <div className="space-y-6">
              <Card className="p-6 bg-sky-50 border-sky-100">
                <h3 className="text-lg font-semibold mb-4 text-sky-800">Prochains Rendez-vous</h3>
                {patient.appointments?.filter((a:any) => new Date(a.date) >= new Date()).length > 0 ? (
                  <ul className="space-y-3">
                    {patient.appointments.filter((a:any) => new Date(a.date) >= new Date()).slice(0,3).map((apt:any) => (
                      <li key={apt.id} className="bg-white p-3 rounded shadow-sm border border-sky-100">
                        <p className="font-semibold text-sm">{new Date(apt.date).toLocaleString()}</p>
                        <Badge className="mt-2">{apt.status}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-sky-600">Aucun rendez-vous à venir.</p>
                )}
                <Button className="w-full mt-4 bg-white text-sky-600 border border-sky-200 hover:bg-sky-100" size="sm">Nouveau RDV</Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact d'urgence</h3>
                <div className="text-sm space-y-2">
                  <p><span className="text-gray-500 block">Nom</span><span className="font-medium">{patient.emergencyContactName || "-"}</span></p>
                  <p><span className="text-gray-500 block">Téléphone</span><span className="font-medium">{patient.emergencyContactPhone || "-"}</span></p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Other tabs would list out consultations, etc. using EmptyState for brevity in this task */}
        {activeTab !== "overview" && (
          <Card className="p-10">
            <EmptyState 
              title={`Aucune donnée pour ${activeTab}`} 
              description="Cette section est vide pour le moment." 
            />
          </Card>
        )}
      </div>
    </div>
  );
}
