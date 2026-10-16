"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { Plus, Search, MoreVertical, Eye, Edit, Trash } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [isActive, setIsActive] = useState("true");

  useEffect(() => {
    fetchPatients();
  }, [page, limit, search, gender, bloodGroup, isActive]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        gender,
        bloodGroup,
        isActive: isActive === "all" ? "" : isActive,
      });
      const res = await fetch(`/api/patients?${queryParams}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPatients(data.data.data);
        setTotal(data.data.meta.total);
      } else {
        toast.error(data.message || "Erreur de chargement");
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

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment désactiver ce patient ?")) return;
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Patient désactivé");
        fetchPatients();
      } else {
        toast.error(data.message || "Erreur de suppression");
      }
    } catch (error) {
      toast.error("Erreur serveur");
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Patients
            <span className="bg-sky-100 text-sky-800 text-sm py-1 px-3 rounded-full">{total}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gérez la liste de vos patients</p>
        </div>
        <Link href="/patients/new">
          <Button className="bg-sky-500 hover:bg-sky-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Patient
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input 
            placeholder="Rechercher par nom, numéro, téléphone..." 
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-4">
          <Select value={gender} onChange={(e) => { setGender(e.target.value); setPage(1); }}>
            <option value="">Tous les sexes</option>
            <option value="MALE">Homme</option>
            <option value="FEMALE">Femme</option>
          </Select>
          <Select value={bloodGroup} onChange={(e) => { setBloodGroup(e.target.value); setPage(1); }}>
            <option value="">Tous les groupes</option>
            <option value="A+">A+</option>
            <option value="O+">O+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="O-">O-</option>
            <option value="B-">B-</option>
            <option value="AB-">AB-</option>
          </Select>
          <Select value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
            <option value="all">Tous</option>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : patients.length === 0 ? (
          <EmptyState 
            title="Aucun patient trouvé" 
            description="Modifiez vos filtres ou ajoutez un nouveau patient." 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">N° Patient</th>
                  <th className="py-3 px-4 font-semibold">Nom complet</th>
                  <th className="py-3 px-4 font-semibold">Téléphone</th>
                  <th className="py-3 px-4 font-semibold">Sexe</th>
                  <th className="py-3 px-4 font-semibold">Âge</th>
                  <th className="py-3 px-4 font-semibold">Groupe Sanguin</th>
                  <th className="py-3 px-4 font-semibold">Statut</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map(patient => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/patients/${patient.id}`)}
                  >
                    <td className="py-3 px-4 font-medium text-sky-600">{patient.patientNumber}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <span className="font-semibold text-gray-800">{patient.firstName} {patient.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{patient.phone || "-"}</td>
                    <td className="py-3 px-4">{patient.gender === "MALE" ? "Homme" : "Femme"}</td>
                    <td className="py-3 px-4">{calculateAge(patient.dateOfBirth)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={patient.bloodGroup ? "secondary" : "outline"} className={patient.bloodGroup ? "bg-red-50 text-red-600 border-red-200" : ""}>
                        {patient.bloodGroup || "-"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={patient.isActive ? "success" : "danger"}>
                        {patient.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-sky-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        {patient.isActive && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600" onClick={() => handleDelete(patient.id)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Afficher</span>
              <Select value={limit.toString()} onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }} className="h-8 py-0">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </Select>
              <span>sur {total}</span>
            </div>
            <Pagination 
              currentPage={page} 
              totalPages={Math.ceil(total / limit)} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
