import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw } from 'lucide-react';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { toast } from 'sonner';

interface QRGeneratorProps {
  courseId: string;
  onClose: () => void;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ courseId, onClose }) => {
  const { generateQRCode, courses } = useFormationSchoolStore();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expiration, setExpiration] = useState<Date | null>(null);
  
  const course = courses.find(c => c.id === courseId);
  
  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const result = await generateQRCode(courseId);
      setQrCode(result.qrCode);
      setExpiration(new Date(result.qrExpiration));
      toast.success('QR generado exitosamente');
    } catch {
      toast.error('Error al generar el QR');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (course?.qrCode && course?.qrExpiration) {
      setQrCode(course.qrCode);
      setExpiration(new Date(course.qrExpiration));
    } else {
      handleGenerateQR();
    }
  }, [courseId]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Código QR de Asistencia</DialogTitle>
          <DialogDescription>
            Escanea este código para registrar asistencia
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {qrCode ? (
            <div className="relative">
              <img 
                src={qrCode} 
                alt="QR Code" 
                className="w-64 h-64 rounded-lg border-2 border-black"
              />
              {expiration && expiration > new Date() && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Activo
                </div>
              )}
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              {loading ? (
                <RefreshCw className="h-8 w-8 animate-spin" />
              ) : (
                <QrCode className="h-16 w-16 text-gray-400" />
              )}
            </div>
          )}
          
          {expiration && (
            <p className="text-sm text-muted-foreground">
              Expira: {expiration.toLocaleTimeString()}
            </p>
          )}
          
          <Button 
            onClick={handleGenerateQR} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Regenerar QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
