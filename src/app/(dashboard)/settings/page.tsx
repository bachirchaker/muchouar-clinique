"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "react-hot-toast";
import { Save, Building, Clock, Globe, Shield } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Paramètres enregistrés avec succès");
    }, 800);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm">Configuration générale du système de la clinique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {/* Simple side navigation for settings */}
          <div className="p-3 bg-sky-50 text-sky-700 rounded-lg font-medium flex items-center gap-2">
            <Building className="w-4 h-4" /> Clinique
          </div>
          <div className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors">
            <Clock className="w-4 h-4" /> Horaires
          </div>
          <div className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors">
            <Globe className="w-4 h-4" /> Préférences
          </div>
          <div className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors">
            <Shield className="w-4 h-4" /> Système
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <form onSubmit={handleSave}>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                Informations de la Clinique
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la clinique</label>
                  <Input defaultValue="MUCHOUAR CLINIQUE" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                  <Input defaultValue="123 Avenue des Forces Armées Royales, Casablanca" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <Input defaultValue="+212 5 22 00 00 00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
                  <Input defaultValue="contact@muchouar-clinique.ma" type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Web</label>
                  <Input defaultValue="https://muchouar-clinique.ma" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant Fiscal (ICE)</label>
                  <Input defaultValue="000111222333444" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-600">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </Card>
          </form>

          {/* Add other cards for Horaires, Préférences, Système... */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              Préférences Locales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                <Select defaultValue="MAD">
                  <option value="MAD">Dirham Marocain (MAD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar US (USD)</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue par défaut</label>
                <Select defaultValue="fr">
                  <option value="fr">Français</option>
                  <option value="ar">Arabe</option>
                  <option value="en">Anglais</option>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="outline">Sauvegarder les préférences</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
