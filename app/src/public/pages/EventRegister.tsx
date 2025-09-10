import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

import { ScanQR } from "@/src/events/pages/ScanQR";

export const EventRegisterPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className=" min-h-svh flex-row items-center justify-center">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">{t('events.registerInEvent')}</h1>

              
            </Card>

            <ScanQR />
        </div>
    );
};
export default EventRegisterPage;