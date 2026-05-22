import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Download, Share, X } from "lucide-react";

interface InstallPWAModalProps {
  open: boolean;
  platform: "ios" | "android" | "other";
  onInstall: () => void;
  onDismiss: () => void;
  onNeverShow: () => void;
}

export const InstallPWAModal: React.FC<InstallPWAModalProps> = ({ open, platform, onInstall, onDismiss, onNeverShow }) => {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const isIOS = platform === "ios";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onDismiss}
    >
      <div className="fixed inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-lg rounded-t-3xl border-t border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-2xl p-6 pb-8"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', animation: 'slideUp 0.35s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />

        {isIOS ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white dark:text-zinc-900" />
              </div>
              <h2 className="text-xl font-semibold mt-2">Instalar App</h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                Instala esta aplicación en tu iPhone para un acceso más rápido
              </p>
            </div>

            {step === 0 ? (
              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full rounded-xl text-base"
                  onClick={() => setStep(1)}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Ver instrucciones
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <ol className="flex flex-col gap-3 text-sm text-left">
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium text-xs shrink-0 mt-0.5">1</span>
                    <span>Toca el botón <strong>Compartir</strong> <Share className="inline w-3.5 h-3.5 -mt-0.5" /> en la barra inferior de Safari</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium text-xs shrink-0 mt-0.5">2</span>
                    <span>Desplázate hacia abajo y toca <strong>{'"Agregar a la pantalla de inicio"'}</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-medium text-xs shrink-0 mt-0.5">3</span>
                    <span>Toca <strong>{'"Agregar"'}</strong> en la esquina superior derecha</span>
                  </li>
                </ol>
                <div className="flex flex-col gap-2 mt-2">
                  <Button size="lg" className="w-full rounded-xl text-base" onClick={onDismiss}>
                    Entendido
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={onNeverShow}>
                <X className="w-3 h-3 mr-1" />
                No volver a mostrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-lg">
                <Download className="w-8 h-8 text-white dark:text-zinc-900" />
              </div>
              <h2 className="text-xl font-semibold mt-2">Instalar App</h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                Instala esta aplicación en tu dispositivo para un acceso más rápido
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="lg" className="w-full rounded-xl text-base" onClick={onInstall}>
                <Download className="w-4 h-4 mr-2" />
                Instalar
              </Button>
              <Button variant="ghost" size="lg" className="w-full rounded-xl text-base text-muted-foreground" onClick={onDismiss}>
                Ahora no
              </Button>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={onNeverShow}>
                <X className="w-3 h-3 mr-1" />
                No volver a mostrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
