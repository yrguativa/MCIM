import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, getDocs, query, where } from "firebase/firestore";
import QRCode from "react-qr-code"; // Librería para generar el QR

import { db } from "../utils";

type FormData = {
    idNumber: string;
};

function GenerateTicket() {
    const { handleSubmit, register } = useForm<FormData>();
    const [qrData, setQrData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const storedIdNumber = localStorage.getItem('idNumber');
        const storedName = localStorage.getItem('name');
        if (storedIdNumber && storedName) {
            setQrData(storedIdNumber);
            setName(storedName);
        }
    }, []);

    const onSubmit = async (data: FormData) => {
        setError(null); // Reiniciar errores previos
        const { idNumber } = data;

        try {
            const q = query(
                collection(db, "ticket-events"),
                where("Identification", "==", idNumber)
            );

            getDocs(q).then(querySnapshot => {
                if (querySnapshot.empty) {
                    setError("El número de identificación no está registrado al evento.");
                    setQrData(null);
                    setName(null);
                    localStorage.removeItem('idNumber');
                    localStorage.removeItem('name');
                    return;
                }

                querySnapshot.forEach(doc => {
                    console.log(`Document ID: ${doc.id}, Data:`, doc.data());

                    setQrData(idNumber);
                    setName(doc.data().Name);
                    localStorage.setItem('idNumber', idNumber);
                    localStorage.setItem('name', doc.data().Name);
                });
            }).catch((error) => {
                console.error("Error al consultar Firebase: ", error);
                setError("El número de identificación no está registrado al evento.");
                setQrData(null);
                setName(null);
                localStorage.removeItem('idNumber');
                localStorage.removeItem('name');
            });

        } catch (error) {
            console.error("Error al consultar Firebase: ", error);
            setError("Hubo un error al verificar el número.");
            setQrData(null);
            setName(null);
            localStorage.removeItem('idNumber');
            localStorage.removeItem('name');
        }
    };

    const handleReset = () => {
        setQrData(null);
        setName(null);
        localStorage.removeItem('idNumber');
        localStorage.removeItem('name');
    };

    return (
        <div>
            <img src="/assets/images/event2.jpg" width="300" alt="logo Aroma" className='m-auto' />
            <h1 className="text-4xl font-bold text-white">Bienvenidos a nuestra reunión</h1>
            {!qrData && (
                <>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-14">
                        <div>
                            <label htmlFor="idNumber" className='mb-14 text-[#F5F5F5]'>Ingresa su número de identificación y validar el ingreso a nuestro evento</label>
                            <Input
                                id="idNumber"
                                placeholder="Ingresa tu número de identificación"
                                className='bg-white mt-8 text-center'
                                {...register("idNumber", { required: "Este campo es obligatorio" })}
                            />
                        </div>

                        <Button type="submit" className="bg-[#601D2A]">Consultar</Button>
                    </form>

                    {error && <div className="text-[#FFE984] mt-4">{error}</div>}
                </>
            )
            }

            {qrData && (
                <>
                    <h2 className='text-white mt-8'>Felicitades <b>{name}</b>, cuentas con un ingreso a evento</h2>
                    <p className='mt-8 mb-4 text-[#F5F5F5]'>Presenta el siguiente QR en el ingreso al evento</p>
                    <div className="mt-6 flex justify-center">
                        <QRCode value={qrData} size={300} />
                    </div>

                    <Button type="button" onClick={handleReset} className='mt-4'>Consultar Otro</Button>
                </>
            )}

            <img src="/assets/images/event2footer.jpg" className='mt-8' alt="logo Aroma" />
        </div>
    )
}

export default GenerateTicket
