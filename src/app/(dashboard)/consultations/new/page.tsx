"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema } from "@/lib/validations/consultation";
import type { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type ConsultationFormValues = z.infer<typeof consultationSchema>;

export default function NewConsultationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      date: new Date().toISOString(),
      status: "IN_PROGRESS",
      chiefComplaint: "",
      symptoms: "",
      physicalExamination: "",
      diagnosis: "",
      treatment: "",
      recommendations: "",
      vitalSigns: {},
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/doctors"),
        ]);
        const pData = await patientsRes.json();
        const dData = await doctorsRes.json();
        if (pData.success) setPatients(pData.data);
        if (dData.success) setDoctors(dData.data);
      } catch (error) {
        toast.error("Erreur de chargement des données");
      }
    };
    fetchData();
  }, []);

  async function onSubmit(data: ConsultationFormValues, status: "IN_PROGRESS" | "COMPLETED") {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        router.push(`/consultations/${result.data.id}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Nouvelle Consultation</h1>
      
      <Form {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations Générales</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.user.lastName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Motif & Symptômes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem><FormLabel>Motif principal</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem><FormLabel>Symptômes</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Signes Vitaux</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["temperature", "bloodPressure", "heartRate", "weight", "height", "oxygenSaturation", "respiratoryRate"].map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`vitalSigns.${key}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Examen & Diagnostic</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="physicalExamination"
                render={({ field }) => (
                  <FormItem><FormLabel>Examen physique</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem><FormLabel>Diagnostic</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem><FormLabel>Traitement</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
            <Button type="button" variant="secondary" onClick={form.handleSubmit((d) => onSubmit(d, "IN_PROGRESS"))} disabled={isSubmitting}>
              Sauvegarder
            </Button>
            <Button type="button" onClick={form.handleSubmit((d) => onSubmit(d, "COMPLETED"))} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Terminer la consultation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
