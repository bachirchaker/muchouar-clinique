"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema } from "@/lib/validations";
import { z } from "zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";

type PatientFormValues = z.infer<typeof patientSchema>;

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        // Format dates for input type="date"
        if (data.data.dateOfBirth) {
            data.data.dateOfBirth = new Date(data.data.dateOfBirth).toISOString().split('T')[0];
        }
        reset(data.data);
      } else {
        toast.error("Erreur de chargement du patient");
        router.push("/patients");
      }
    } catch (error) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PatientFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      
      if (res.ok && responseData.success) {
        toast.success("Patient mis à jour avec succès");
        router.push(`/patients/${id}`);
      } else {
        toast.error(responseData.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 space-y-6"><Skeleton className="h-10 w-1/4" /><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/patients/${id}`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier le Patient</h1>
            <p className="text-gray-500 text-sm">Mettre à jour les informations du patient</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/patients/${id}`}>
            <Button variant="outline">
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </Link>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-600">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <form className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Identité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <Input {...register("firstName")} error={errors.firstName?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <Input {...register("lastName")} error={errors.lastName?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <Input type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
              <Select {...register("gender")} error={errors.gender?.message}>
                <option value="MALE">Homme</option>
                <option value="FEMALE">Femme</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <Input {...register("phone")} error={errors.phone?.message} placeholder="+212..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input type="email" {...register("email")} error={errors.email?.message} placeholder="email@exemple.com" />
            </div>
          </div>
        </Card>

        {/* Following the same structure as new patient... */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Adresse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
              <Input {...register("address")} error={errors.address?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <Input {...register("city")} error={errors.city?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <Input {...register("country")} error={errors.country?.message} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Informations médicales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
              <Select {...register("bloodGroup")} error={errors.bloodGroup?.message}>
                <option value="">Sélectionner</option>
                <option value="A+">A+</option>
                <option value="O+">O+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="O-">O-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <Input {...register("allergies")} error={errors.allergies?.message} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents médicaux / Maladies chroniques</label>
              <Input {...register("chronicDiseases")} error={errors.chronicDiseases?.message} />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
