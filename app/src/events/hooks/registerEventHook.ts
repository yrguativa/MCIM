import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import i18n from '@/src/i18n';
import { useDebounce } from 'use-debounce';
import { useMutation } from '@tanstack/react-query';

import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { DisciplesService } from '@/src/disciples/services/disciples.services';
import { eventService } from '../services/event.services';
import { SearchDiscipleInput, SearchDiscipleSchema } from '../schemas/registerEventSchema';
import { ScanData } from '../models/scanData';
import { EventAttendance } from '../models/eventAttendance';
import { setSpanishHtml5QrcodeScannerStrings } from '../helpers/html5-qrcode-strings';

export const useRegisterEventHook = () => {
    const { t } = useTranslation();
    const { ministries } = useMinistryStore();
    const { onShowModalNotFound } = useDiscipleStore();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [scanError, setScanError] = useState<string>('');
    const [isNeedleToSearch, setIsNeedleToSearch] = useState<boolean>(false);
    const [ministryOfDisciple, setMinistryOfDisciple] = useState<string>('');
    const [isOpenModalRegister, setIsOpenModalRegister] = useState<boolean>(false);


    const form = useForm<SearchDiscipleInput>({
        resolver: zodResolver(SearchDiscipleSchema),
        defaultValues: {
            identification: '',
        },
    });
    const identification = form.watch('identification');
    const [debouncedIdentification] = useDebounce(identification, 1500);

    // Initialize the QR code scanner strings based on the current language
    useEffect(() => {
        if (i18n.language) {
            setSpanishHtml5QrcodeScannerStrings(t);
        }
        // Create a scanner instance
        scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: 250,
                aspectRatio: 1,
            },
            false
        );

        // Start scanning
        scannerRef.current.render((decodedText) => {
            try {
                const eventData = JSON.parse(decodedText);
                setScanData(eventData);
                // Stop scanning after a successful scan
                scannerRef.current?.clear();
            } catch (e) {
                if (e instanceof Error) {
                    setScanError(`${t('events.qrInvalid')}: ${e.message}`);
                } else {
                    setScanError(t('events.qrInvalid'));
                }
            }
        }, (error) => {
            console.error(error);
        });

        // Clean the scanner when the component is removed
        return () => {
            scannerRef.current?.clear();
        };
    }, [i18n.language]);

    // When the debounced identification changes, search for the disciple
    useEffect(() => {
        if (!debouncedIdentification || debouncedIdentification.length <= 0 || debouncedIdentification != searchDiscipleMutation.data?.identification) {
            setIsNeedleToSearch(true);
        }
    }, [debouncedIdentification]);

    const onSubmit = async (searchData: SearchDiscipleInput) => {
        if (searchData && searchData.identification && searchData.identification.length >= 5) {
            setIsNeedleToSearch(false);
            searchDiscipleMutation.mutate(searchData.identification);
        }
    };

    const onRegisterEvent = async () => {
        if (!scanData || scanData == null || !searchDiscipleMutation.data || isNeedleToSearch) return;

        const attendance: Partial<EventAttendance> = {
            eventId: scanData.id,
            discipleId: searchDiscipleMutation.data.id,
        };

        registerAttendanceMutation.mutate(attendance);
    };


    const searchDiscipleMutation = useMutation({
        mutationFn: (identification: string) =>
            DisciplesService.searchByIdentification(identification),
        onSuccess: (data) => {
            if (!data) {
                onShowModalNotFound();
                setMinistryOfDisciple('');
            }
            else {
                const ministry = ministries.find(m => m.id === data.ministryId);
                if (ministry) {
                    setMinistryOfDisciple(ministry.name);
                }
            }
        },
    });


    const registerAttendanceMutation = useMutation({
        mutationFn: (attendance: Partial<EventAttendance>) => eventService.registerAttendance(attendance),
        onSuccess: (data) => {
            console.log("🚀 ~ useRegisterEventHook ~ data:", data)
            setScanData(null);
            form.reset();
            setIsOpenModalRegister(true);
        },
        onError: (error) => {
            if (error instanceof Error) {
                setScanError(error.message);
            }
        }
    });

    return {
        scanError,
        scanData,
        form,
        ministryOfDisciple,
        isNeedleToSearch,
        isOpenModalRegister,
        setIsOpenModalRegister,

        onSubmit,
        onRegisterEvent,
        isLoadingRegister: registerAttendanceMutation.isPending,
        registerError: registerAttendanceMutation.error,
        dataSearch: searchDiscipleMutation.data,
        isLoadingSearch: searchDiscipleMutation.isPending,
        searchError: searchDiscipleMutation.error,
    };
}