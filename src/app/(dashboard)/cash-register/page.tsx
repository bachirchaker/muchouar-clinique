"use client";

import { useState, useEffect } from "react";
import { Coins, AlertCircle, ArrowRightRight, History } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function CashRegisterPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [openingBalance, setOpeningBalance] = useState("");
  const [closingBalance, setClosingBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/cash-register");
      const data = await res.json();
      if (data.success) {
        setSession(data.data);
      }
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleOpen = async () => {
    if (!openingBalance || isNaN(Number(openingBalance))) return toast.error("Montant invalide");
    setSubmitting(true);
    try {
      const res = await fetch("/api/cash-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openingBalance: Number(openingBalance) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchSession();
      } else {
        toast.error(data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!closingBalance || isNaN(Number(closingBalance))) return toast.error("Montant invalide");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/cash-register/${session.id}/close`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closingBalance: Number(closingBalance) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setSession(null);
        setClosingBalance("");
      } else {
        toast.error(data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Ouvrir la Caisse</CardTitle>
            <CardDescription>Saisissez le montant d'ouverture (fond de caisse)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant initial (MAD)</label>
                <Input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} placeholder="0.00" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleOpen} disabled={submitting}>Ouvrir la session</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const payments = session.payments || [];
  const totalIncome = payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0);
  const expectedTotal = Number(session.openingBalance) + totalIncome;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caisse du jour</h1>
          <p className="text-muted-foreground">Session ouverte le {format(new Date(session.openedAt), "dd MMM yyyy à HH:mm", { locale: fr })}</p>
        </div>
        <Badge variant="outline" className="text-lg py-1"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>Ouverte</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Transactions de la session</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Heure</TableHead>
                    <TableHead>Facture / Patient</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Montant (MAD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Aucune transaction</TableCell></TableRow>
                  ) : payments.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{format(new Date(p.createdAt), "HH:mm")}</TableCell>
                      <TableCell>{p.invoiceId}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">+{p.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Résumé</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Fond de caisse</span><span className="font-medium">{session.openingBalance} MAD</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Entrées (+)</span><span className="font-medium text-green-600">+{totalIncome} MAD</span></div>
              <div className="pt-4 border-t flex justify-between items-center text-lg font-bold"><span>Total attendu</span><span>{expectedTotal} MAD</span></div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader className="pb-4">
              <CardTitle className="text-destructive flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> Fermer la Caisse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant compté (Espèces)</label>
                <Input type="number" value={closingBalance} onChange={(e) => setClosingBalance(e.target.value)} placeholder="Total réel en caisse" />
              </div>
              {closingBalance && !isNaN(Number(closingBalance)) && (
                <div className={`p-3 rounded-md text-sm ${Number(closingBalance) === expectedTotal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Écart constaté : {(Number(closingBalance) - expectedTotal).toFixed(2)} MAD
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full" onClick={handleClose} disabled={submitting}>Clôturer la session</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
