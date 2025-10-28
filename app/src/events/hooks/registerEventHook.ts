import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Html5QrcodeScanner } from 'html5-qrcode';
import i18n from '@/src/i18n';
import { useDebounce } from 'use-debounce';

import { setSpanishHtml5QrcodeScannerStrings } from '../helpers/html5-qrcode-strings';
//import { EventAttendance } from '../models/eventAttendanceSchema';
import { SearchDiscipleInput, SearchDiscipleSchema } from '../schemas/registerEventSchema';


import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
//import { useEventStore } from '../store/event.store';
import { ScanData } from '../models/scanData';

export const useRegisterEventHook = () => {
    const { t } = useTranslation();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanData, setScanData] = useState<ScanData | null>(null);
    const [error, setError] = useState<string>('');
    const [ministryOfDisciple, setMinistryOfDisciple] = useState<string>('');

    const { discipleSelected, searchByIdentification, clearDiscipleSelected } = useDiscipleStore();
    const { ministries } = useMinistryStore();
    //const { registerAttendance } = useEventStore();

    const form = useForm<SearchDiscipleInput>({
        resolver: zodResolver(SearchDiscipleSchema),
        defaultValues: {
            identification: '',
        },
    });

    const identification = form.watch('identification');
    const [debouncedIdentification] = useDebounce(identification, 800);

    // Initialize the QR code scanner
    useEffect(() => {
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
                    setError(`${t('events.qrInvalid')}: ${e.message}`);
                } else {
                    setError(t('events.qrInvalid'));
                }
            }
        }, (error) => {
            console.error(error);
        });

        // Clean the scanner when the component is removed
        return () => {
            scannerRef.current?.clear();
        };
    }, []);

    // Initialize the QR code scanner strings based on the current language
    useEffect(() => {
        if (i18n.language) {
            setSpanishHtml5QrcodeScannerStrings(t);
        }
    }, [i18n.language]);

    // // When the debounced identification changes, search for the disciple
    useEffect(() => {
        if (debouncedIdentification && debouncedIdentification != discipleSelected?.identification) {
            clearDiscipleSelected();
        }
    }, [debouncedIdentification]);

    // When a disciple is selected, populate the form fields
    useEffect(() => {
        if (discipleSelected) {
            if (form.getValues('identification') !== discipleSelected.identification) {
                form.setValue('identification', discipleSelected.identification);
            }
            const ministry = ministries.find(m => m.id === discipleSelected.ministryId);
            if (ministry) {
                setMinistryOfDisciple(ministry.name);
            }
        } else {
            setMinistryOfDisciple('');
        }
    }, [discipleSelected]);


    const onSubmit = async (searchData: SearchDiscipleInput) => {
        if (searchData && searchData.identification && searchData.identification.length >= 5) {
            searchByIdentification(searchData.identification);
        }
    };

    // const onRegisterEvent = async (values: RegisterEventInput) => {
    //     if (!scanData) return;

    //     const attendance: Partial<EventAttendance> = {
    //         eventId: scanData.id
    //     };
    //     if (discipleSelected && discipleSelected.id) {
    //         attendance.discipleId = discipleSelected.id;
    //     } else {
    //         attendance.name = values.name;
    //         attendance.lastName = values.lastName;
    //         attendance.identification = values.identification;
    //         attendance.phone = values.phoneNumber;
    //         attendance.ministryId = values.ministryId;
    //     }

    //     await registerAttendance(attendance);
    // };

    return {
        error,
        scanData,
        form,
        onSubmit,
        discipleSelected,
        ministryOfDisciple
    };
}