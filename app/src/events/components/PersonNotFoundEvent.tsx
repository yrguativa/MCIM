import React from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

import { useDiscipleStore } from "@/src/disciples/store/disciple.store";

export const PersonNotFoundEvent: React.FC = () => {
    const { t } = useTranslation();
    const { showModalNotFound, toggleModalNotFound } = useDiscipleStore();
    console.log("🚀 ~ PersonNotFoundEvent ~ showModalNotFound:", showModalNotFound)

    return (
        <Dialog open={showModalNotFound}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('events.titleModalNotFound')}</DialogTitle>
                </DialogHeader>
                <div className="flex">
                    <ShieldAlert size={58} className="inline-block text-amber-300" />
                    {t('events.messageNotFound')}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={toggleModalNotFound}>{t('common.accept')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}