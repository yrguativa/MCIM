import React from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

import { useEventStore } from "../store/event.store";

export const EventRegisterConfirmModal: React.FC = () => {
    const { t } = useTranslation();
    const { isOpenModal, toggleModal } = useEventStore();

    return (
        <Dialog open={isOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('events.titleModalRegisterEvent')}</DialogTitle>
                </DialogHeader>
                <BadgeCheck color="#10b981" size={48} /> {t('events.messageRegisterEvent')}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={toggleModal}>{t('common.accept')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}