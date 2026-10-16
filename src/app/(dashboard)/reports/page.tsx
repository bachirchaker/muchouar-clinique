"use client";

import { useState } from "react";
import { Download, FileText, BarChart, DollarSign, Users, Package, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">Générez et exportez des rapports détaillés.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))} />
          <span>à</span>
          <Input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))} />
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Tout Exporter</Button>
        </div>
      </div>

      <Tabs defaultValue="medical" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="medical">Médicaux</TabsTrigger>
          <TabsTrigger value="financial">Financiers</TabsTrigger>
          <TabsTrigger value="hr">Ressources Humaines</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="medical" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Consultations", desc: "Statistiques et liste des consultations", icon: FileText },
            { title: "Nouveaux Patients", desc: "Acquisition et démographie des patients", icon: Users },
            { title: "Diagnostics Fréquents", desc: "Analyse épidémiologique des diagnostics", icon: Activity },
          ].map((report, i) => (
            <ReportCard key={i} title={report.title} desc={report.desc} Icon={report.icon} />
          ))}
        </TabsContent>
        <TabsContent value="financial" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Revenus", desc: "Analyse des entrées par service", icon: DollarSign },
            { title: "Dépenses", desc: "Rapport détaillé des dépenses cliniques", icon: BarChart },
            { title: "Impayés & Créances", desc: "Factures en attente et retards", icon: AlertCircle },
          ].map((report, i) => (
            <ReportCard key={i} title={report.title} desc={report.desc} Icon={report.icon} />
          ))}
        </TabsContent>
        <TabsContent value="hr" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Présence", desc: "Pointage et heures de travail", icon: Clock },
            { title: "Absences & Congés", desc: "Historique et planning des congés", icon: Calendar },
          ].map((report, i) => (
            <ReportCard key={i} title={report.title} desc={report.desc} Icon={report.icon} />
          ))}
        </TabsContent>
        <TabsContent value="stock" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Consommation", desc: "Utilisation des médicaments et consommables", icon: Package },
            { title: "Expirations Proches", desc: "Produits approchant leur date de péremption", icon: AlertTriangle },
            { title: "Ruptures de Stock", desc: "Articles à commander d'urgence", icon: ShoppingCart },
          ].map((report, i) => (
            <ReportCard key={i} title={report.title} desc={report.desc} Icon={report.icon} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportCard({ title, desc, Icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardFooter className="pt-4 flex gap-2">
        <Button variant="outline" size="sm" className="w-full">Générer PDF</Button>
        <Button variant="outline" size="sm" className="w-full">Générer Excel</Button>
      </CardFooter>
    </Card>
  );
}

import { Activity, AlertCircle, AlertTriangle, Clock, ShoppingCart } from "lucide-react";
