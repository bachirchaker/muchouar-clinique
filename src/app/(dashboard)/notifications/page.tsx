"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";
import { Bell, Check, Info, AlertTriangle, Calendar } from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const url = activeTab === "unread" ? "/api/notifications?isRead=false" : "/api/notifications";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PUT" });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      toast.success("Toutes les notifications marquées comme lues");
      fetchNotifications();
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'SYSTEM': return <Info className="w-5 h-5 text-gray-500" />;
      case 'ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm">Centre de notifications de la clinique</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          <Check className="w-4 h-4 mr-2" />
          Tout marquer comme lu
        </Button>
      </div>

      <div className="border-b border-gray-200 flex space-x-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "all" ? "border-sky-500 text-sky-600" : "border-transparent text-gray-500"}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "unread" ? "border-sky-500 text-sky-600" : "border-transparent text-gray-500"}`}
        >
          Non lues
        </button>
      </div>

      <Card className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12"><EmptyState title="Aucune notification" description="Vous êtes à jour !" /></div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`p-4 flex gap-4 transition-colors ${!notif.isRead ? "bg-sky-50/50" : "hover:bg-gray-50"}`}>
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold ${!notif.isRead ? "text-gray-900" : "text-gray-700"}`}>{notif.title}</h3>
                  <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
                <p className={`text-sm mt-1 ${!notif.isRead ? "text-gray-700" : "text-gray-500"}`}>{notif.message}</p>
              </div>
              {!notif.isRead && (
                <button onClick={() => markAsRead(notif.id)} className="text-sky-600 hover:bg-sky-100 p-2 rounded-full self-center transition-colors" title="Marquer comme lu">
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
