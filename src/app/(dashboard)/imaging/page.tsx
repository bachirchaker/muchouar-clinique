"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScanFace, Image as ImageIcon } from "lucide-react";

export default function ImagingPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const tests = []; // Mock empty data for now

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imagerie Médicale</h1>
          <p className="text-gray-500 text-sm">Gestion des examens radiologiques et échographiques</p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600">
          <ScanFace className="w-4 h-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      <div className="border-b border-gray-200 flex space-x-4">
        {["ALL", "REQUESTED", "SCHEDULED", "COMPLETED"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === tab ? "border-sky-500 text-sky-600" : "border-transparent text-gray-500"
            }`}
          >
            {tab === "ALL" ? "Tous" : tab === "REQUESTED" ? "Demandés" : tab === "SCHEDULED" ? "Programmés" : "Terminés"}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {tests.length === 0 ? (
          <EmptyState 
            title="Aucun examen d'imagerie" 
            description="Il n'y a pas d'examens correspondant à ce filtre." 
            icon={<ImageIcon className="w-12 h-12 text-gray-300" />}
          />
        ) : (
          <div className="p-4">Table will go here</div>
        )}
      </Card>
    </div>
  );
}
