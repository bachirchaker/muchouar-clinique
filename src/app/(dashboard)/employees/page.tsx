"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { SearchInput } from "@/components/ui/search-input";
import { formatDate } from "@/lib/utils";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, [search, department, position]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (department) params.append("department", department);
      if (position) params.append("position", position);

      const res = await fetch(`/api/employees?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setEmployees(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Employés</h1>
          <p className="text-sm text-slate-500">Gérez le personnel de la clinique</p>
        </div>
        <Link href="/employees/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvel Employé
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-border">
        <div className="flex-1">
          <SearchInput onSearch={setSearch} placeholder="Rechercher par nom, matricule..." />
        </div>
        <Select 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">Tous les services</option>
          <option value="Urgences">Urgences</option>
          <option value="Cardiologie">Cardiologie</option>
          <option value="Administration">Administration</option>
        </Select>
        <Select 
          value={position} 
          onChange={(e) => setPosition(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="">Tous les postes</option>
          <option value="Médecin">Médecin</option>
          <option value="Infirmier">Infirmier</option>
          <option value="Agent d'accueil">Agent d'accueil</option>
        </Select>
      </div>

      {loading ? (
        <Loading className="py-12" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Employé</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Date d'embauche</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow hoverable={false}>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  Aucun employé trouvé.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.employeeNumber}</TableCell>
                  <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{formatDate(emp.hireDate)}</TableCell>
                  <TableCell>
                    <Badge variant={emp.isActive ? "success" : "default"}>
                      {emp.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/employees/${emp.id}`}>
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
