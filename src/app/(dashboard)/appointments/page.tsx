"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Calendar as CalendarIcon, User, Clock, ChevronRight } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  CONFIRMED: { label: "Confirmé", variant: "default" },
  ARRIVED: { label: "Arrivé", variant: "secondary" },
  IN_CONSULTATION: { label: "En consultation", variant: "secondary" },
  COMPLETED: { label: "Terminé", variant: "success" },
  CANCELLED: { label: "Annulé", variant: "destructive" },
  NO_SHOW: { label: "Non présenté", variant: "destructive" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/appointments", window.location.origin);
      if (filter !== "ALL") url.searchParams.set("status", filter);
      if (searchQuery) url.searchParams.set("search", searchQuery);
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter, searchQuery]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérez l'agenda et les rendez-vous des patients.
          </p>
        </div>
        <Link href="/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Rendez-vous
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="ALL" className="w-full sm:w-auto" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="ALL">Tous</TabsTrigger>
            <TabsTrigger value="PENDING">En attente</TabsTrigger>
            <TabsTrigger value="CONFIRMED">Confirmés</TabsTrigger>
            <TabsTrigger value="ARRIVED">Arrivés</TabsTrigger>
            <TabsTrigger value="COMPLETED">Terminés</TabsTrigger>
            <TabsTrigger value="CANCELLED">Annulés</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Heure</TableHead>
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
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun rendez-vous trouvé.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(appt.date), "dd MMM yyyy", { locale: fr })}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {appt.startTime} - {appt.endTime}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{appt.patient.firstName[0]}{appt.patient.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{appt.patient.firstName} {appt.patient.lastName}</span>
                        <span className="text-xs text-muted-foreground">{appt.patient.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>Dr. {appt.doctor.user.lastName}</span>
                      <span className="text-xs text-muted-foreground">{appt.doctor.specialty}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={appt.reason}>
                    {appt.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_MAP[appt.status]?.variant as any || "default"}>
                      {STATUS_MAP[appt.status]?.label || appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {appt.status === "PENDING" && (
                        <Button variant="outline" size="sm" onClick={() => updateStatus(appt.id, "CONFIRMED")}>
                          Confirmer
                        </Button>
                      )}
                      {appt.status === "CONFIRMED" && (
                        <Button variant="outline" size="sm" onClick={() => updateStatus(appt.id, "ARRIVED")}>
                          Arrivé
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
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
