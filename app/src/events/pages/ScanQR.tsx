import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { EventAttendance } from '../models/event';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from 'use-debounce';

interface ScanData {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location: string;
}

const formSchema = z.object({
  identification: z.string()
    .min(5, 'La identificación debe tener al menos 5 caracteres')
    .max(20, 'La identificación no puede tener más de 20 caracteres')
});

type FormValues = z.infer<typeof formSchema>;

export const ScanQR: React.FC = () => {
  const { t } = useTranslation();
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identification: '',
    },
  });

  const identification = form.watch('identification');
  const [debouncedIdentification] = useDebounce(identification, 800);

  useEffect(() => {
    if (debouncedIdentification && debouncedIdentification.length >= 5) {
      // Aquí puedes realizar la búsqueda cuando el valor haya sido debounced
      console.log('Buscando identificación:', debouncedIdentification);
      // Implementa tu lógica de búsqueda aquí
    }
  }, [debouncedIdentification]);

  useEffect(() => {
    // Create a scanner instance
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1,
      },
      false
    );

    // Start scanning
    scannerRef.current.render((decodedText) => {
      try {
        const eventData = JSON.parse(decodedText);
        setScanData(eventData);
        // Stop scanning after a successful scan
        scannerRef.current?.clear();
      } catch (e) {
        if (e instanceof Error) {
          setError(`${t('events.qrInvalid')}: ${e.message}`);
        } else {
          setError(t('events.qrInvalid'));
        }
      }
    }, (error) => {
      console.error(error);
    });

    // Clean the scanner when the component is removed
    return () => {
      scannerRef.current?.clear();
    };
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!scanData) return;

    const attendance: Partial<EventAttendance> = {
      eventId: scanData.id,
      discipleId: values.identification,
      timestamp: new Date(),
    };

    // Implementa aquí la lógica para registrar la asistencia
    console.log('Registrando asistencia:', attendance);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{t('events.registerInEvent')}</h1>

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="identification">Identificación</Label>
            <Input
              {...form.register('identification')}
              id="identification"
              placeholder="Ingresa la identificación"
              className="mt-1"
            />
            {form.formState.errors.identification && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.identification.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!scanData || !form.formState.isValid}
            className="w-full"
          >
            {t('events.registerAttendance')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
