
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useEventStore } from "../events/store/event.store";
import { cn } from "@/lib/utils";

export const EventRegisterPage: React.FC = () => {
  const { id } = useParams();

  const getEventState = useEventStore(state => state.getEvent);
  const eventState = useEventStore(state => state.event);

  useEffect(() => {
    if (id && !eventState) {
      getEventState(id);
    }
  }, [id]);

  return (

    <div className={cn("container py-10 w-screen mx-auto h-screen", "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500")} >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
      </div>

      {
        eventState &&
        (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="font-medium">{eventState.name}</div>
            <div className="text-xs text-gray-500">
              {format(new Date(eventState.date), 'HH:mm')}
            </div>
            <div className="text-xs truncate">
              {eventState.location}
            </div>

            <span className="block mb-2 mt-6">
              Fecha Inicio: {format(new Date(eventState.date), 'dd/MM/yyyy')}
            </span>
            <span className="block mb-2">
              Hora: {format(new Date(eventState.date), 'HH:mm')}
            </span>
            <span className="block mb-2">
              Fecha Fin: {eventState.endDate ? format(new Date(eventState.endDate), 'dd/MM/yyyy') : ""}
            </span>
            <span className="block mb-2">
              Ubicación: {eventState.location}
            </span>
            <span className="block mb-2">
              Capidad: {eventState.capacity || 'Sin límite'}
            </span>
            <span className="block mb-2">
              Asistencia:
            </span>

            <span className="block mb-2 mt-4">
              Organizador: {eventState.createdBy || 'No asignado'}
            </span>
            <span className="block mb-2">
              Creado: {format(new Date(eventState.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
        )
      }
    </div >
  );
}
