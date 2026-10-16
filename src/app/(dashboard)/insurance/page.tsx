"use client";

import { useState, useEffect } from "react";
import { Plus, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function InsurancePage() {
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const res = await fetch("/api/insurance");
        const data = await res.json();
        if (data.success) {
          setInsurances(data.data || []);
        }
      } catch (error) {
        toast.error("Erreur de chargement des assurances");
      } finally {
        setLoading(false);
      }
    };
    fetchInsurances();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assurances & Mutuelles</h1>
          <p className="text-muted-foreground">Gérez les compagnies d'assurance et organismes de prise en charge.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Nouvelle Assurance</Button>
      </div>

      <div className="flex justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Rechercher une compagnie..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Compagnie</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taux Couverture Défaut</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : insurances.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucune assurance trouvée. Utilisez la base de données démo ou ajoutez-en une.</TableCell></TableRow>
            ) : (
              insurances.map(ins => (
                <TableRow key={ins.id}>
                  <TableCell className="font-medium flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> {ins.name}</TableCell>
                  <TableCell>{ins.type || "Mutuelle"}</TableCell>
                  <TableCell>{ins.coverageRate ? `${ins.coverageRate}%` : "Variable"}</TableCell>
                  <TableCell>{ins.phone || "-"}</TableCell>
                  <TableCell><Badge variant={ins.isActive !== false ? "success" : "secondary"}>{ins.isActive !== false ? "Actif" : "Inactif"}</Badge></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
