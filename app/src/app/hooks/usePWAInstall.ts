import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  platform: "ios" | "android" | "other";
  showPrompt: boolean;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [state, setState] = useState<PWAInstallState>(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as unknown as { standalone?: boolean }).standalone));
    return {
      canInstall: false,
      isInstalled: isStandalone,
      platform: isIOS ? "ios" : isAndroid ? "android" : "other",
      showPrompt: false,
    };
  });

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, showPrompt: true }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState((prev) => ({ ...prev, canInstall: true, showPrompt: true }));
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      setState((prev) => ({ ...prev, isInstalled: true, showPrompt: false }));
    };
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      setState((prev) => ({ ...prev, canInstall: false, isInstalled: true, showPrompt: false }));
      return true;
    }
    setState((prev) => ({ ...prev, showPrompt: false }));
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, showPrompt: false }));
  }, []);

  const ua = navigator.userAgent;
  const isMobile = /iPad|iPhone|iPod|Android|Mobi|mobile|BlackBerry|Opera Mini|IEMobile|WPDesktop/.test(ua);
  const shouldSuggest =
    isMobile && state.showPrompt && !state.isInstalled && (state.platform === "android" || state.platform === "ios");

  return { ...state, shouldSuggest, install, dismiss };
}
