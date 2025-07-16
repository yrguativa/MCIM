import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { EventAttendance } from '../models/event';

interface ScanData {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location: string;
}

export const ScanQR: React.FC = () => {
  const [discipleId, setDiscipleId] = useState('');
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Crear una instancia del escáner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1,
      },
      false
    );

    // Iniciar el escaneo
    scannerRef.current.render((decodedText) => {
      try {
        const eventData = JSON.parse(decodedText);
        setScanData(eventData);
        // Detener el escaneo después de un escaneo exitoso
        scannerRef.current?.clear();
      } catch (e) {
        setError('QR inválido');
      }
    }, (error) => {
      console.error(error);
    });

    // Limpiar el escáner cuando el componente se desmonte
    return () => {
      scannerRef.current?.clear();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanData || !discipleId) return;

    const attendance: Partial<EventAttendance> = {
      eventId: scanData.id,
      discipleId: discipleId,
      timestamp: new Date(),
    };

    try {
      // TODO: Implementar la llamada al servicio
      console.log('Registrando asistencia:', attendance);
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Registrar Asistencia</h1>
        
        <div className="mb-6">
          <div id="qr-reader" className="w-full max-w-sm mx-auto"></div>
        </div>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {scanData && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-bold text-lg mb-2">Evento Escaneado:</h3>
            <p><strong>Nombre:</strong> {scanData.name}</p>
            <p><strong>Fecha de inicio:</strong> {new Date(scanData.date).toLocaleString()}</p>
            {scanData.endDate && (
              <p><strong>Fecha de finalización:</strong> {new Date(scanData.endDate).toLocaleString()}</p>
            )}
            <p><strong>Ubicación:</strong> {scanData.location}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="discipleId">ID del Discípulo</Label>
            <Input
              id="discipleId"
              value={discipleId}
              onChange={(e) => setDiscipleId(e.target.value)}
              placeholder="Ingresa el ID del discípulo"
              required
              className="mt-1"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!scanData || !discipleId}
            className="w-full"
          >
            Registrar Asistencia
          </Button>
        </form>
      </Card>
    </div>
  );
};
