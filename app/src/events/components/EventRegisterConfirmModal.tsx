import React from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import confetti from "canvas-confetti";

import { SheetDescription } from "@/components/ui/sheet";

type EventRegisterConfirmModalProps = {
    isOpenModal: boolean;
    setOpenModal: (close: boolean) => void;
};


export const EventRegisterConfirmModal: React.FC<EventRegisterConfirmModalProps> =
    ({ isOpenModal, setOpenModal }) => {
        const { t } = useTranslation();


        if (isOpenModal) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        return (
            <Dialog open={isOpenModal} onOpenChange={() => setOpenModal(false)}>
                <DialogContent className="max-w-sm bor">
                    <DialogHeader>
                        <DialogTitle>{t('events.titleModalRegisterEvent')}</DialogTitle>
                        <SheetDescription className="sr-only">
                            description goes here
                        </SheetDescription>
                    </DialogHeader>
                    <div className="flex flex-row justify-center items-center gap-1 text-sm text-start">
                        <BadgeCheck className="text-green-500" size={38} />
                        <span className="text-lg">
                            {t('events.messageRegisterEvent')}
                        </span>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpenModal(false)}>{t('common.accept')}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }