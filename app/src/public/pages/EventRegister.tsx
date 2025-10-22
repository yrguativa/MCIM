import React from "react";
import { useTranslation } from "react-i18next";
import ScanQR from "@/src/events/pages/ScanQR";

import iconUrl from "@/src/assets/mci.svg";

const EventRegisterPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className=" min-h-svh flex-row items-center justify-center pt-4">
            <div className="flex items-center m-auto ml-8 justify-center">
                <img src={iconUrl} width="50" height="50" alt="MCI Icon" />
                <h1 className="text-3xl font-bold mt-2 ml-4">
                    {t('AppTitle')}
                </h1>
            </div>

            <ScanQR />
        </div>
    );
};
export default EventRegisterPage;