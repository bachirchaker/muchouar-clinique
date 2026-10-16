"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

export default function EmployeeDetailPage() {
  const params = useParams();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setEmployee({
        id: params.id,
        employeeNumber: "EMP-0001",
        firstName: "Ahmed",
        lastName: "Benali",
        position: "Infirmier",
        department: "Urgences",
        phone: "0600000001",
        email: "ahmed.benali@clinique.ma",
        hireDate: "2021-01-15",
        isActive: true,
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) return <Loading fullPage />;
  if (!employee) return <div>Employé non trouvé</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Employés", href: "/employees" },
          { label: `${employee.firstName} ${employee.lastName}` },
        ]}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-xl border border-border">
        <Avatar fallback={`${employee.firstName} ${employee.lastName}`} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
            <Badge variant={employee.isActive ? "success" : "default"}>
              {employee.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <p className="text-slate-500 mb-2">{employee.position} • {employee.department}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center text-slate-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {employee.email}
            </span>
            <span className="flex items-center text-slate-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {employee.phone}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Modifier</Button>
          <Button variant="danger">Suspendre</Button>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: "info",
            label: "Informations",
            content: (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Informations Générales</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-sm text-slate-500">Matricule</p>
                      <p className="font-medium">{employee.employeeNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date d'embauche</p>
                      <p className="font-medium">{employee.hireDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          },
          {
            id: "presence",
            label: "Présence",
            content: (
              <Card>
                <CardContent className="p-6 text-center text-slate-500">
                  Module de présence à implémenter.
                </CardContent>
              </Card>
            )
          },
          {
            id: "conges",
            label: "Congés",
            content: (
              <Card>
                <CardContent className="p-6 text-center text-slate-500">
                  Historique des congés à implémenter.
                </CardContent>
              </Card>
            )
          },
          {
            id: "docs",
            label: "Documents",
            content: (
              <Card>
                <CardContent className="p-6 text-center text-slate-500">
                  Gestion documentaire à implémenter.
                </CardContent>
              </Card>
            )
          }
        ]}
      />
    </div>
  );
}
