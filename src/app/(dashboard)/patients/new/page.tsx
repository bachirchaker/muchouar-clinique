"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

type PatientFormValues = z.infer<typeof patientSchema>;

export default function NewPatientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: "MALE",
    }
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      
      if (res.ok && responseData.success) {
        toast.success("Patient créé avec succès");
        router.push("/patients");
      } else {
        toast.error(responseData.message || "Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouveau Patient</h1>
            <p className="text-gray-500 text-sm">Ajoutez un nouveau dossier patient au système</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/patients">
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
              <Input {...register("country")} error={errors.country?.message} defaultValue="Maroc" />
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
              <Input {...register("allergies")} error={errors.allergies?.message} placeholder="Ex: Pénicilline, arachides..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents médicaux / Maladies chroniques</label>
              <Input {...register("chronicDiseases")} error={errors.chronicDiseases?.message} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chirurgies précédentes</label>
              <Input {...register("previousSurgeries")} error={errors.previousSurgeries?.message} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Médicaments actuels</label>
              <Input {...register("currentMedications")} error={errors.currentMedications?.message} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact d'urgence & Divers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du contact d'urgence</label>
              <Input {...register("emergencyContactName")} error={errors.emergencyContactName?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone d'urgence</label>
              <Input {...register("emergencyContactPhone")} error={errors.emergencyContactPhone?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <Input {...register("profession")} error={errors.profession?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut marital</label>
              <Select {...register("maritalStatus")} error={errors.maritalStatus?.message}>
                <option value="">Sélectionner</option>
                <option value="SINGLE">Célibataire</option>
                <option value="MARRIED">Marié(e)</option>
                <option value="DIVORCED">Divorcé(e)</option>
                <option value="WIDOWED">Veuf(ve)</option>
              </Select>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
