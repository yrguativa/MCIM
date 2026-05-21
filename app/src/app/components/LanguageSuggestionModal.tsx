import React from 'react';
import { Button } from '@/components/ui/button';

interface LanguageSuggestionModalProps {
  open: boolean;
  detectedLang: string;
  onAccept: () => void;
  onDismiss: () => void;
}

const langNames: Record<string, string> = {
  en: 'English',
};

const langFlags: Record<string, string> = {
  en: '🇬🇧',
};

export const LanguageSuggestionModal: React.FC<LanguageSuggestionModalProps> = ({ open, detectedLang, onAccept, onDismiss }) => {
  const langName = langNames[detectedLang] || detectedLang;
  const flag = langFlags[detectedLang] || '🌐';

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onDismiss}
    >
      <div className="fixed inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-lg rounded-t-3xl border-t border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-2xl p-6 pb-8 translate-y-0"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.12)', animation: 'slideUp 0.35s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />

        <div className="flex flex-col items-center text-center gap-1">
          <span className="text-5xl">{flag}</span>
          <h2 className="text-xl font-semibold mt-2">{langName} detected</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs">
            Your browser language is <strong>{langName}</strong>. Switch the interface to {langName}?
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Button onClick={onAccept} size="lg" className="w-full rounded-xl text-base">
            {flag} Switch to {langName}
          </Button>
          <Button variant="ghost" onClick={onDismiss} size="lg" className="w-full rounded-xl text-base text-muted-foreground">
            Keep Spanish
          </Button>
        </div>
      </div>
    </div>
  );
};
