"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Breadcrumb } from "@/components/ui/breadcrumb";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { employeeSchema } from "@/lib/validations";

export default function NewEmployeePage() {
  const router = useRouter();

  // In a real app we'd use react-hook-form + zod here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // mock submit
    alert("Employé créé avec succès!");
    router.push("/employees");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Employés", href: "/employees" },
          { label: "Nouvel Employé" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ajouter un employé</h1>
        <p className="text-sm text-slate-500">Remplissez les informations du nouvel employé</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identité</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Prénom" required />
            <Input label="Nom" required />
            <Input label="CIN / Passeport" required />
            <Input label="Date de naissance" type="date" required />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Téléphone" type="tel" required />
            <Input label="Email" type="email" required />
            <Input label="Adresse" className="md:col-span-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Poste & Affectation</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Poste" required>
              <option value="">Sélectionner</option>
              <option value="Médecin">Médecin</option>
              <option value="Infirmier">Infirmier</option>
              <option value="Agent d'accueil">Agent d'accueil</option>
            </Select>
            <Select label="Service" required>
              <option value="">Sélectionner</option>
              <option value="Urgences">Urgences</option>
              <option value="Cardiologie">Cardiologie</option>
            </Select>
            <Input label="Date d'embauche" type="date" required />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contrat & Salaire</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Type de contrat" required>
              <option value="">Sélectionner</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Anapec">Anapec</option>
            </Select>
            <Input label="Salaire de base (MAD)" type="number" required />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer l'employé
          </Button>
        </div>
      </form>
    </div>
  );
}
