"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Printer, Stethoscope, Activity, FileCheck, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function ConsultationDetailPage() {
  const params = useParams();
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await fetch(`/api/consultations/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setConsultation(data.data);
        } else {
          toast.error("Consultation introuvable");
        }
      } catch (error) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!consultation) return <div className="p-8 text-center">Consultation introuvable</div>;

  const vitals = consultation.vitalSigns || {};

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consultation du {format(new Date(consultation.date), "dd MMMM yyyy", { locale: fr })}</h1>
          <p className="text-muted-foreground mt-1">
            Patient: {consultation.patient.firstName} {consultation.patient.lastName} | Médecin: Dr. {consultation.doctor.user.lastName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={consultation.status === "COMPLETED" ? "success" : "default"} className="text-sm px-3 py-1">
            {consultation.status === "COMPLETED" ? "Terminée" : "En cours"}
          </Badge>
          <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Imprimer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /><CardTitle>Examen Clinique</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Motif Principal</h4>
                <p>{consultation.chiefComplaint || "-"}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Symptômes</h4>
                <p>{consultation.symptoms || "-"}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Examen Physique</h4>
                <p>{consultation.physicalExamination || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><FileCheck className="h-5 w-5 text-primary" /><CardTitle>Diagnostic & Traitement</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Diagnostic</h4>
                <p className="font-medium text-lg">{consultation.diagnosis || "-"}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Traitement</h4>
                <p>{consultation.treatment || "-"}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Recommandations</h4>
                <p>{consultation.recommendations || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><Activity className="h-5 w-5 text-primary" /><CardTitle>Signes Vitaux</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Température</p><p className="font-semibold">{vitals.temperature || "-"} °C</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Tension</p><p className="font-semibold">{vitals.bloodPressure || "-"}</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Fréq. Cardiaque</p><p className="font-semibold">{vitals.heartRate || "-"} bpm</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Saturation O2</p><p className="font-semibold">{vitals.oxygenSaturation || "-"} %</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Poids</p><p className="font-semibold">{vitals.weight || "-"} kg</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Taille</p><p className="font-semibold">{vitals.height || "-"} cm</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" /><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-start"><FileText className="h-4 w-4 mr-2" /> Créer une prescription</Button>
              <Button variant="outline" className="w-full justify-start"><FileText className="h-4 w-4 mr-2" /> Demander un examen labo</Button>
              <Button variant="outline" className="w-full justify-start"><FileText className="h-4 w-4 mr-2" /> Créer une facture</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
