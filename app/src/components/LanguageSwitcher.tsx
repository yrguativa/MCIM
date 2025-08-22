import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher : React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'es' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="outline"
            onClick={toggleLanguage}
            className="fixed bottom-4 right-4"
        >
            {i18n.language === 'en' ? '🇪🇸 ES' : '🇬🇧 EN'}
        </Button>
    );
};
