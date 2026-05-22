import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import i18n from '@/src/i18n';
import { useDebounce } from 'use-debounce';

import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { DisciplesService } from '@/src/disciples/services/disciples.services';
import { EventService } from '../services/event.services';
import { SearchDiscipleInput, SearchDiscipleSchema } from '../schemas/registerEventSchema';
import { ScanData } from '../models/scanData';
import { EventAttendance } from '../models/eventAttendance';
import { setSpanishHtml5QrcodeScannerStrings } from '../helpers/html5-qrcode-strings';

type Attendance = {
    id: string;
    name: string;
    lastName: string;
    ministry: string;
    identification: string;
};


export const useRegisterEventHook = () => {
    const { t } = useTranslation();
    const { ministries } = useMinistryStore();
    const { onShowModalNotFound } = useDiscipleStore();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [scanError, setScanError] = useState<string>('');
    const [attandance, setAttandance] = useState<Attendance | undefined>(undefined);
    const [isOpenModalRegister, setIsOpenModalRegister] = useState<boolean>(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [searchError, setSearchError] = useState<Error | null>(null);
    const [isLoadingRegister, setIsLoadingRegister] = useState(false);
    const [registerError, setRegisterError] = useState<Error | null>(null);


    const form = useForm<SearchDiscipleInput>({
        resolver: zodResolver(SearchDiscipleSchema as any),
        defaultValues: {
            identification: '',
        },
    });
    const identification = form.watch('identification');
    const [debouncedIdentification] = useDebounce(identification, 600);

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
        if (!debouncedIdentification || debouncedIdentification.length <= 0 || debouncedIdentification != attandance?.identification) {
            setAttandance(undefined);
        }
    }, [debouncedIdentification]);

    const onSearchDisciple = async (searchData: SearchDiscipleInput) => {
        if (searchData && searchData.identification && searchData.identification.length >= 5) {
            setIsLoadingSearch(true);
            setSearchError(null);
            try {
                const data = await DisciplesService.searchByIdentification(searchData.identification);
                if (!data) {
                    onShowModalNotFound();
                    setAttandance(undefined);
                } else {
                    const ministry = ministries.find(m => m.id === data.ministryId);
                    if (ministry) {
                        setAttandance({
                            id: data.id,
                            name: data.name,
                            ministry: ministry.name,
                            lastName: data.lastName,
                            identification: data.identification,
                        });
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    setSearchError(error);
                }
            } finally {
                setIsLoadingSearch(false);
            }
        }
    };

    const onRegisterEvent = async () => {
        if (!scanData || scanData == null || !attandance) return;

        const attendance: Partial<EventAttendance> = {
            eventId: scanData.id,
            discipleId: attandance.id,
        };

        setIsLoadingRegister(true);
        setRegisterError(null);
        try {
            await EventService.registerAttendance(attendance);
            setIsOpenModalRegister(true);
        } catch (error) {
            if (error instanceof Error) {
                setRegisterError(error);
                setScanError(error.message);
            }
        } finally {
            setIsLoadingRegister(false);
        }
    };

    const onCloseConfirmModal = () => {
        setIsOpenModalRegister(false);
        setScanData(null);
        form.reset();
    };


    return {
        scanError,
        scanData,

        form,
        onSearchDisciple,
        attandance,
        isLoadingSearch,
        searchError,

        onRegisterEvent,
        isLoadingRegister,
        isOpenModalRegister,
        onCloseConfirmModal,
        registerError,
    };
}
