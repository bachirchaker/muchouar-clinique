"use client";

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const url = statusFilter !== "all" ? `/api/leaves?status=${statusFilter}` : "/api/leaves";
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setLeaves(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchLeaves();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Demandes de Congé</h1>
          <p className="text-sm text-slate-500">Gestion des absences et congés</p>
        </div>
        <Button>Nouvelle demande</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl">
        <div className="border-b border-border p-4 pb-0">
          <Tabs
            variant="line"
            tabs={[
              { id: "all", label: "Toutes", content: null },
              { id: "pending", label: "En attente", content: null },
              { id: "approved", label: "Approuvées", content: null },
            ]}
            defaultTabId="all"
            onChange={(id) => setStatusFilter(id)}
          />
        </div>
        
        <div className="p-4">
          {loading ? (
            <Loading className="py-8" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Du</TableHead>
                  <TableHead>Au</TableHead>
                  <TableHead>Jours</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map(leave => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.employeeName}</TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{formatDate(leave.startDate)}</TableCell>
                    <TableCell>{formatDate(leave.endDate)}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          leave.status === "approved" ? "success" : 
                          leave.status === "pending" ? "warning" : "danger"
                        }
                      >
                        {leave.status === "approved" ? "Approuvé" : 
                         leave.status === "pending" ? "En attente" : "Rejeté"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {leave.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="xs" variant="success" onClick={() => updateLeaveStatus(leave.id, "approved")}>✓</Button>
                          <Button size="xs" variant="danger" onClick={() => updateLeaveStatus(leave.id, "rejected")}>✕</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {leaves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Aucune demande trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
