import React from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import confetti from "canvas-confetti";

import { useEventStore } from "../store/event.store";

export const EventRegisterConfirmModal: React.FC = () => {
    const { t } = useTranslation();
    const { isOpenModal, toggleModal } = useEventStore();

    if(isOpenModal){
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    return (
        <Dialog open={isOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('events.titleModalRegisterEvent')}</DialogTitle>
                </DialogHeader>
                <BadgeCheck className="text-green-500" size={48} /> {t('events.messageRegisterEvent')}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={toggleModal}>{t('common.accept')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}