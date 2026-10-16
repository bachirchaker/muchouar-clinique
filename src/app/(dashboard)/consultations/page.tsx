"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await fetch("/api/consultations");
        const data = await res.json();
        if (data.success) {
          setConsultations(data.data);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des consultations");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            Historique et dossiers médicaux des patients.
          </p>
        </div>
        <Link href="/consultations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Consultation
          </Button>
        </Link>
      </div>

      <div className="flex justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Rechercher..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Médecin</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Chargement...</TableCell>
              </TableRow>
            ) : consultations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune consultation trouvée.
                </TableCell>
              </TableRow>
            ) : (
              consultations.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {format(new Date(c.date), "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {c.patient.firstName} {c.patient.lastName}
                  </TableCell>
                  <TableCell>Dr. {c.doctor.user.lastName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.chiefComplaint}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "COMPLETED" ? "success" : "default"}>
                      {c.status === "COMPLETED" ? "Terminée" : "En cours"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/consultations/${c.id}`}>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
