import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from './i18n';

import { Toaster } from "@/components/ui/sonner";
import { ProgressIndeterminate } from '@/components/ui/progress-indeterminate';
import { LanguageSuggestionModal } from './app/components/LanguageSuggestionModal';
import { InstallPWAModal } from './app/components/InstallPWAModal';
import { usePWAInstall } from './app/hooks/usePWAInstall';

import { GeneralRoutes } from './routes';

import './App.css'

const App: React.FC = () => {
  const [showLangSuggestion, setShowLangSuggestion] = useState(false);
  const [detectedLang, setDetectedLang] = useState('');
  const { shouldSuggest, platform, install, dismiss, isInstalled } = usePWAInstall();
  const [isPublicRoute, setIsPublicRoute] = useState(() => {
    const hash = window.location.hash;
    return hash.startsWith("#/login") || hash.startsWith("#/register") || hash.startsWith("#/forgot-password") || hash.startsWith("#/public");
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash;
      setIsPublicRoute(hash.startsWith("#/login") || hash.startsWith("#/register") || hash.startsWith("#/forgot-password") || hash.startsWith("#/public"));
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en'];
    if (supportedLangs.includes(browserLang) && browserLang !== 'es' && !localStorage.getItem('lang-suggested')) {
      setDetectedLang(browserLang);
      setShowLangSuggestion(true);
    }
  }, []);

  const handleNeverShowPWA = () => {
    localStorage.setItem('pwa-dismissed', 'true');
    dismiss();
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HashRouter>
        <Suspense fallback={<ProgressIndeterminate />}>
          <GeneralRoutes />
        </Suspense>
        <LanguageSuggestionModal
          open={showLangSuggestion}
          detectedLang={detectedLang}
          onAccept={() => {
            i18n.changeLanguage(detectedLang);
            localStorage.setItem('lang-suggested', 'true');
            setShowLangSuggestion(false);
          }}
          onDismiss={() => {
            localStorage.setItem('lang-suggested', 'true');
            setShowLangSuggestion(false);
          }}
        />
        <InstallPWAModal
          open={shouldSuggest && !localStorage.getItem('pwa-dismissed') && !isInstalled && !isPublicRoute}
          platform={platform}
          onInstall={install}
          onDismiss={dismiss}
          onNeverShow={handleNeverShowPWA}
        />
      </HashRouter>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App;
