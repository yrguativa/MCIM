import React from "react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import confetti from "canvas-confetti";

import { SheetDescription } from "@/components/ui/sheet";

type EventRegisterConfirmModalProps = {
    isOpenModal: boolean;
    onModalClose: () => void;
    fullName: string;
};

export const EventRegisterConfirmModal: React.FC<EventRegisterConfirmModalProps> =
    ({ isOpenModal, onModalClose, fullName }) => {
        const { t } = useTranslation();

        if (isOpenModal) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        return (
            <Dialog open={isOpenModal} onOpenChange={onModalClose}>
                <DialogContent className="max-w-sm bor">
                    <DialogHeader>
                        <DialogTitle>{t('events.titleModalRegisterEvent')}</DialogTitle>
                        <SheetDescription className="sr-only">
                            description goes here
                        </SheetDescription>
                    </DialogHeader>
                    <div className="flex flex-row justify-center items-center gap-1 text-sm text-start">
                        <BadgeCheck className="text-green-500" size={78} />

                        <span className="text-lg">
                            {t('events.messageRegisterEvent')}
                            <b>
                                {fullName}
                            </b>
                        </span>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onModalClose}>{t('common.accept')}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }