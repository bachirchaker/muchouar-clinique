"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string, variant: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" }> = {
  DRAFT: { label: "Brouillon", variant: "secondary" },
  ORDERED: { label: "Commandé", variant: "warning" },
  RECEIVED: { label: "Reçu", variant: "success" },
  CANCELLED: { label: "Annulé", variant: "destructive" },
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/purchases");
        const data = await res.json();
        if (data.success) {
          setPurchases(data.data || []);
        }
      } catch (error) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const filtered = filter === "ALL" ? purchases : purchases.filter(p => p.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achats & Commandes</h1>
          <p className="text-muted-foreground">Gérez le réapprovisionnement et les commandes fournisseurs.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Nouvelle Commande</Button>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="ALL" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="ALL">Tous</TabsTrigger>
            <TabsTrigger value="DRAFT">Brouillon</TabsTrigger>
            <TabsTrigger value="ORDERED">Commandé</TabsTrigger>
            <TabsTrigger value="RECEIVED">Reçu</TabsTrigger>
            <TabsTrigger value="CANCELLED">Annulé</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="N° de commande..." className="pl-8" />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Commande</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Montant Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucune commande trouvée.</TableCell></TableRow>
            ) : (
              filtered.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber || `CMD-${order.id.substring(0,6).toUpperCase()}`}</TableCell>
                  <TableCell>{format(new Date(order.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell>{order.supplier?.name || "Fournisseur Inconnu"}</TableCell>
                  <TableCell className="text-right font-medium">{order.totalAmount} MAD</TableCell>
                  <TableCell><Badge variant={STATUS_MAP[order.status]?.variant || "default"}>{STATUS_MAP[order.status]?.label || order.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
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
