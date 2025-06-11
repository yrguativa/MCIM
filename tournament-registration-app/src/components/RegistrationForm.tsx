import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { saveTeamRegistration } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

import './RegistrationForm.css';

// Zod schema for validation
const participantSchema = z.object({
    name: z.string().min(5, 'Nombre completo es requerido'),
    age: z.string()
        .min(1, 'Edad es requerida')
        .refine((val) => !isNaN(parseInt(val)), { message: "Debe ser un número" })
        .refine((val) => parseInt(val) >= 15 && parseInt(val) <= 80, { message: "Edad debe estar entre 15 y 80 años" }),
    document: z.string().min(5, 'Número de documento es requerido'),
    ministry: z.string().min(1, 'Ministerio es requerido'),
    leader: z.string().min(1, 'Líder es requerido'),
});

const formSchema = z.object({
    teamName: z.string().min(3, 'Nombre del equipo es requerido'),
    captain: z.string().min(5, 'Nombre del capitán es requerido'),
    delegate: z.string().min(5, 'Nombre del delegado es requerido'),
    phoneNumber: z.string()
        .min(7, 'Número de celular debe tener al menos 7 dígitos')
        .refine((val) => /^\d+$/.test(val), { message: "Solo debe contener números" }),
    participants: z.array(participantSchema).min(6, 'Se requieren al menos 6 participantes'),
});

const RegistrationForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamName: '',
            captain: '',
            delegate: '',
            phoneNumber: '',
            participants: Array(12).fill().map(() => ({
                name: '',
                age: '',
                document: '',
                ministry: '',
                leader: '',
            })),
        },
    });

    const { fields } = useFieldArray({
        control,
        name: 'participants',
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            // Filter out empty participant rows
            const filteredParticipants = data.participants.filter(p => p.name.trim() !== '');
            const formData = { ...data, participants: filteredParticipants };

            await saveTeamRegistration(formData);
            reset();
            navigate('/success');
        } catch (error) {
            console.error("Error saving registration:", error);
            alert('Error al guardar los datos. Por favor intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-header">
                <h1>PLANILLA DE INSCRIPCIÓN TORNEO DE VOLEIBOL 2025</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
                <div className="form-group">
                    <label htmlFor="teamName">Nombre del equipo:</label>
                    <input
                        id="teamName"
                        type="text"
                        {...register('teamName')}
                        className={errors.teamName ? 'error' : ''}
                    />
                    {errors.teamName && <span className="error-message">{errors.teamName.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="captain">Capitán del equipo:</label>
                    <input
                        id="captain"
                        type="text"
                        {...register('captain')}
                        className={errors.captain ? 'error' : ''}
                    />
                    {errors.captain && <span className="error-message">{errors.captain.message}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group grow">
                        <label htmlFor="delegate">Delegado del equipo:</label>
                        <input
                            id="delegate"
                            type="text"
                            {...register('delegate')}
                            className={errors.delegate ? 'error' : ''}
                        />
                        {errors.delegate && <span className="error-message">{errors.delegate.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Celular:</label>
                        <input
                            id="phoneNumber"
                            type="text"
                            {...register('phoneNumber')}
                            className={errors.phoneNumber ? 'error' : ''}
                        />
                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
                    </div>
                </div>

                <div className="participants-table">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombres y apellidos</th>
                                <th>Edad</th>
                                <th># documento</th>
                                <th>Ministerio</th>
                                <th>Líder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`participants.${index}.name`)}
                                            className={errors.participants?.[index]?.name ? 'error' : ''}
                                        />
                                        {errors.participants?.[index]?.name && (
                                            <div className="error-message">{errors.participants[index].name.message}</div>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`participants.${index}.age`)}
                                            className={errors.participants?.[index]?.age ? 'error' : ''}
                                        />
                                        {errors.participants?.[index]?.age && (
                                            <div className="error-message">{errors.participants[index].age.message}</div>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`participants.${index}.document`)}
                                            className={errors.participants?.[index]?.document ? 'error' : ''}
                                        />
                                        {errors.participants?.[index]?.document && (
                                            <div className="error-message">{errors.participants[index].document.message}</div>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`participants.${index}.ministry`)}
                                            className={errors.participants?.[index]?.ministry ? 'error' : ''}
                                        />
                                        {errors.participants?.[index]?.ministry && (
                                            <div className="error-message">{errors.participants[index].ministry.message}</div>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`participants.${index}.leader`)}
                                            className={errors.participants?.[index]?.leader ? 'error' : ''}
                                        />
                                        {errors.participants?.[index]?.leader && (
                                            <div className="error-message">{errors.participants[index].leader.message}</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {errors.participants && !Array.isArray(errors.participants) && (
                    <div className="error-message">{errors.participants.message}</div>
                )}

                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Generar Inscripción'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;