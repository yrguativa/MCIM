import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const InstallSuggestionModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [open, setOpen] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua)
    setIsIos(ios)

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e)
      // Only show the modal if user hasn't dismissed before
      if (!localStorage.getItem('install-suggested')) setOpen(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener)

    // For iOS, suggest install if on mobile Safari
    if (ios && /Safari/.test(ua) && !localStorage.getItem('install-suggested')) {
      setOpen(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener)
    }
  }, [])

  const onInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      setDeferredPrompt(null)
    }
    localStorage.setItem('install-suggested', 'true')
    setOpen(false)
  }

  const onDismiss = () => {
    localStorage.setItem('install-suggested', 'true')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onDismiss}
    >
      <div className="fixed inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-lg rounded-t-3xl border-t border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-2xl p-6 pb-8 translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />

        <div className="flex flex-col items-center text-center gap-1">
          <img src="/icons/icon-192.svg" className="h-16 w-16" alt="app icon" />
          <h2 className="text-xl font-semibold mt-2">Instalar MCIM</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs">
            Puedes instalar MCIM en tu dispositivo para acceder más rápido.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          {!isIos ? (
            <Button onClick={onInstallClick} size="lg" className="w-full rounded-xl text-base">
              Instalar
            </Button>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">Para instalar en iOS: toca el botón <strong>Compartir</strong> y luego <strong>Agregar a la pantalla de inicio</strong>.</div>
              <Button onClick={onDismiss} size="lg" className="w-full rounded-xl text-base mt-4">
                Entendido
              </Button>
            </>
          )}

          <Button variant="ghost" onClick={onDismiss} size="lg" className="w-full rounded-xl text-base text-muted-foreground">
            Recordar más tarde
          </Button>
        </div>
      </div>
    </div>
  )
}
