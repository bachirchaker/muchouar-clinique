"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { formatCurrency } from "@/lib/utils";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (specialty) params.append("specialty", specialty);
        const res = await fetch(`/api/doctors?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setDoctors(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [specialty]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Médecins</h1>
          <p className="text-sm text-slate-500">Annuaire et planning des médecins</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-border flex gap-4 w-full md:w-1/3">
        <Select 
          value={specialty} 
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full"
        >
          <option value="">Toutes les spécialités</option>
          <option value="Cardiologie">Cardiologie</option>
          <option value="Neurologie">Neurologie</option>
          <option value="Pédiatrie">Pédiatrie</option>
        </Select>
      </div>

      {loading ? (
        <Loading className="py-12" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doc => (
            <Card key={doc.id} hoverable>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar fallback={`${doc.employee.firstName} ${doc.employee.lastName}`} size="lg" className="mb-4" />
                <h3 className="text-lg font-bold">Dr. {doc.employee.firstName} {doc.employee.lastName}</h3>
                <Badge variant="primary" className="my-2">{doc.specialty}</Badge>
                
                <div className="mt-4 w-full text-sm space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation</span>
                    <span className="font-medium">{formatCurrency(doc.consultationFee)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Disponibilité</span>
                    <span className="font-medium text-right flex flex-col">
                      {doc.availability.map((day: string) => (
                        <span key={day}>{day}</span>
                      ))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {doctors.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-500">
               Aucun médecin trouvé.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
