
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Bot, CalendarDays, CalendarPlus, Clock, Download, MapPinCheckInside, Users } from "lucide-react";

import { useEventStore } from "../../events/store/event.store";
import { ScanData } from "@/src/events/models/scanData";

const EventPage: React.FC = () => {
  const { id } = useParams();

  const getEventState = useEventStore(state => state.getEvent);
  const eventState = useEventStore(state => state.event);

  const downloadQR = () => {
    const svg = document.querySelector('.qr-code-container svg') as SVGSVGElement;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(svg);
    const DOMURL = window.URL || window.webkitURL || window;

    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svgBlob);

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);

      const imgURI = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${eventState?.name || 'evento'}-qr.png`;
      downloadLink.href = imgURI;
      downloadLink.click();
    };

    img.src = url;
  };

  const dataQR: ScanData = {
    id: eventState?.id || '',
    event: eventState?.name || '',
    date: eventState?.date
      ? (typeof eventState.date === "string" ? eventState.date : eventState.date.toISOString())
      : new Date().toISOString(),
    location: eventState?.location || '',
  };

  useEffect(() => {
    if (id && (!eventState || eventState.id !== id)) {
      getEventState(id);
    }
  }, [id]);

  return (

    <div className={cn("container py-10 w-screen mx-auto h-screen", "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500")} >
      <div className="flex flex-col justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{eventState ? eventState.name : "Evento"}</h1>
      </div>

      {eventState && (
        <div className="flex flex-row items-center justify-around space-y-6">
          <div className="bg-white/30 backdrop-blur-md  p-6 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Código QR del Evento</h2>
            <div className="qr-code-container">
              <QRCodeSVG
                value={JSON.stringify(dataQR)}
                size={400}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">Escanea este código para acceder al evento</p>
            <Button
              onClick={downloadQR}
              className="mt-4 flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Descargar QR
            </Button>
          </div>
          <div className="bg-white/30 backdrop-blur-md  p-6 rounded-lg shadow-md">
            <div className="font-bold text-2xl">{eventState.name}</div>
            <div className="text-xs truncate">
              {eventState.description || ""}
            </div>
            <div className="text-xs text-gray-500">
              {format(new Date(eventState.date), 'HH:mm')}
            </div>

            <span className="block mb-2 mt-6">
              <MapPinCheckInside className="inline mr-1" /> Lugar:  {eventState.location}
            </span>

            <span className="block mb-2 mt-6">
              <CalendarDays className="inline mr-1" /> Fecha Inicio: {format(new Date(eventState.date), 'dd/MM/yyyy')}
            </span>
            <span className="block mb-2">
              <Clock className="inline mr-1" />Hora: {format(new Date(eventState.date), 'HH:mm')}
            </span>
            <span className="block mb-2">
              <CalendarDays className="inline mr-1" /> Fecha Fin: {eventState.endDate ? format(new Date(eventState.endDate), 'dd/MM/yyyy') : ""}
            </span>
            <span className="block mb-2">
              <Users className="inline mr-1" />Capidad: {eventState.capacity || 'Sin límite'}
            </span>
            <span className="block mb-2">
              Asistencia:
            </span>

            <span className="block mb-2 mt-4">
              <Bot className="inline mr-1" />Organizador: {eventState.createdBy || 'No asignado'}
            </span>
            <span className="block mb-2">
              <CalendarPlus className="inline mr-1" />Creado: {format(new Date(eventState.createdAt), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPage;