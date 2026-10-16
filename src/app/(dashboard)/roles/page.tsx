"use client";

import { useState } from "react";
import { Plus, Search, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DEFAULT_ROLES = [
  { id: "1", name: "Administrateur", description: "Accès complet au système" },
  { id: "2", name: "Médecin", description: "Accès médical complet" },
  { id: "3", name: "Infirmier", description: "Accès soins et suivi" },
  { id: "4", name: "Réceptionniste", description: "Gestion des patients et agenda" },
  { id: "5", name: "Comptable", description: "Gestion financière" },
];

const PERMISSION_MODULES = [
  "Patients",
  "Rendez-vous",
  "Consultations",
  "Ordonnances",
  "Laboratoire",
  "Facturation",
  "Assurances",
  "Stock",
  "Ressources Humaines",
  "Paramètres",
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLES[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rôles & Permissions</h1>
          <p className="text-muted-foreground">Gérez les accès et les droits des utilisateurs du système.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Nouveau Rôle</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center"><Shield className="mr-2 h-5 w-5" /> Rôles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {DEFAULT_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 text-left border-l-4 transition-colors ${
                    selectedRole.id === role.id ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/30"
                  }`}
                >
                  <div className="font-medium">{role.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{role.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Permissions - {selectedRole.name}</CardTitle>
              <CardDescription>Définissez les droits d'accès pour ce rôle.</CardDescription>
            </div>
            <Button size="sm"><Save className="mr-2 h-4 w-4" /> Enregistrer</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Module</TableHead>
                  <TableHead className="text-center">Afficher</TableHead>
                  <TableHead className="text-center">Créer</TableHead>
                  <TableHead className="text-center">Modifier</TableHead>
                  <TableHead className="text-center">Supprimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSION_MODULES.map((module) => (
                  <TableRow key={module}>
                    <TableCell className="font-medium">{module}</TableCell>
                    <TableCell className="text-center"><Checkbox defaultChecked={selectedRole.name === 'Administrateur'} /></TableCell>
                    <TableCell className="text-center"><Checkbox defaultChecked={selectedRole.name === 'Administrateur'} /></TableCell>
                    <TableCell className="text-center"><Checkbox defaultChecked={selectedRole.name === 'Administrateur'} /></TableCell>
                    <TableCell className="text-center"><Checkbox defaultChecked={selectedRole.name === 'Administrateur'} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
