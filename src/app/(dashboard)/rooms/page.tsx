"use client";
import React, { useState, useEffect } from "react";
import { Plus, Users, Bed } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  const fetchRooms = async () => {
    setLoading(true);
    let url = "/api/rooms";
    if (filter !== "all") url += `?status=${filter}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800 border-green-200';
      case 'OCCUPIED': return 'bg-red-100 text-red-800 border-red-200';
      case 'RESERVED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MAINTENANCE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CLEANING': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-white';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chambres</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Chambre
        </button>
      </div>

      <div className="mb-6 flex space-x-4 overflow-x-auto">
        {[
          { id: "all", label: "Toutes" },
          { id: "AVAILABLE", label: "Disponibles" },
          { id: "OCCUPIED", label: "Occupées" },
          { id: "CLEANING", label: "En nettoyage" },
          { id: "MAINTENANCE", label: "Maintenance" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-md text-sm whitespace-nowrap shadow-sm border ${filter === tab.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Aucune chambre trouvée</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room: any) => (
            <div key={room.id} className={`rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold dark:text-white">{room.roomNumber}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Étage {room.floor} • {room.department}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {room.beds?.length || 0} lit(s)
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Capacité: {room.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
