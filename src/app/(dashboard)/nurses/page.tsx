"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";

export default function NursesPage() {
  const [nurses, setNurses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch just to show data
    setTimeout(() => {
      setNurses([
        { id: "1", name: "Ahmed Benali", department: "Urgences", shift: "Nuit (20:00 - 08:00)", status: "En poste" },
        { id: "2", name: "Sara Mernissi", department: "Pédiatrie", shift: "Jour (08:00 - 16:00)", status: "Repos" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Infirmiers</h1>
          <p className="text-sm text-slate-500">Gestion du personnel infirmier</p>
        </div>
      </div>

      {loading ? (
        <Loading className="py-12" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nurses.map(nurse => (
              <TableRow key={nurse.id}>
                <TableCell className="font-medium">{nurse.name}</TableCell>
                <TableCell>{nurse.department}</TableCell>
                <TableCell>{nurse.shift}</TableCell>
                <TableCell>
                  <Badge variant={nurse.status === "En poste" ? "success" : "default"}>
                    {nurse.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
