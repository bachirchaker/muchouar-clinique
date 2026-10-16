"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { name: 'Jan', revenue: 40000, expenses: 24000 },
  { name: 'Fév', revenue: 30000, expenses: 13980 },
  { name: 'Mar', revenue: 55000, expenses: 38000 },
  { name: 'Avr', revenue: 45000, expenses: 39080 },
  { name: 'Mai', revenue: 60000, expenses: 48000 },
  { name: 'Juin', revenue: 65000, expenses: 38000 },
];

const patientData = [
  { name: 'Lun', patients: 120 },
  { name: 'Mar', patients: 132 },
  { name: 'Mer', patients: 101 },
  { name: 'Jeu', patients: 143 },
  { name: 'Ven', patients: 190 },
  { name: 'Sam', patients: 90 },
];

const specialtyData = [
  { name: 'Cardiologie', value: 400 },
  { name: 'Pédiatrie', value: 300 },
  { name: 'Général', value: 300 },
  { name: 'Orthopédie', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-muted-foreground">Vue d'ensemble des performances de la clinique.</p>
        </div>
        <Select defaultValue="6months">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="6months">6 derniers mois</SelectItem>
            <SelectItem value="1year">1 an</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus & Dépenses</CardTitle>
            <CardDescription>Évolution financière mensuelle (MAD)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenus" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Dépenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flux Patients</CardTitle>
            <CardDescription>Nombre de patients par jour</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Spécialité</CardTitle>
            <CardDescription>Consultations par département</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={specialtyData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Taux d'Occupation</CardTitle>
            <CardDescription>Chambres et lits d'hospitalisation</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center flex-col relative">
             <div className="w-48 h-48 rounded-full border-8 border-muted flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-primary" style={{height: '75%'}}></div>
                <div className="w-40 h-40 bg-background rounded-full flex items-center justify-center z-10 flex-col">
                  <span className="text-4xl font-bold text-primary">75%</span>
                  <span className="text-xs text-muted-foreground">30/40 Lits</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
