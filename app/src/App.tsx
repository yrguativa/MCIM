import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from './i18n';

import { Toaster } from "@/components/ui/sonner";
import { ProgressIndeterminate } from '@/components/ui/progress-indeterminate';
import { LanguageSuggestionModal } from './app/components/LanguageSuggestionModal';

import { GeneralRoutes } from './routes';

import './App.css'

const App: React.FC = () => {
  const [showLangSuggestion, setShowLangSuggestion] = useState(false);
  const [detectedLang, setDetectedLang] = useState('');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en'];
    if (supportedLangs.includes(browserLang) && browserLang !== 'es' && !localStorage.getItem('lang-suggested')) {
      setDetectedLang(browserLang);
      setShowLangSuggestion(true);
    }
  }, []);

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
      </HashRouter>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App;
