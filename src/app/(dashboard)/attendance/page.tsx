"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchRecords();
  }, [date]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?dateFrom=${date}&dateTo=${date}`);
      if (res.ok) {
        const json = await res.json();
        setRecords(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type: string) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: "me", // Assuming logged in user
          type,
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok) {
        alert(`${type === 'check-in' ? 'Arrivée' : 'Départ'} enregistrée`);
        fetchRecords();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Présence</h1>
          <p className="text-sm text-slate-500">Suivi des horaires et pointages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAction('check-in')}>Pointage Arrivée</Button>
          <Button variant="secondary" onClick={() => handleAction('check-out')}>Pointage Départ</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-border inline-block">
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <Loading className="py-12" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Arrivée</TableHead>
              <TableHead>Départ</TableHead>
              <TableHead>Retard</TableHead>
              <TableHead>Heures sup.</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map(record => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employeeName}</TableCell>
                <TableCell>{record.checkIn || "-"}</TableCell>
                <TableCell>{record.checkOut || "-"}</TableCell>
                <TableCell className={record.lateMinutes > 0 ? "text-danger" : ""}>
                  {record.lateMinutes} min
                </TableCell>
                <TableCell className={record.overtimeMinutes > 0 ? "text-success" : ""}>
                  {record.overtimeMinutes} min
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      record.status === "Présent" ? "success" : 
                      record.status === "Retard" ? "warning" : "default"
                    }
                  >
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Aucun pointage trouvé pour cette date.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
