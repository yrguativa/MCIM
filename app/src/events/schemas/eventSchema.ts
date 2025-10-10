import * as z from "zod";

export const EventSchema = z.object({
    id: z.string(),
    name: z.string()
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
        .max(100, { message: 'El nombre no puede exceder los 100 caracteres' }),
    description: z.string()
        .min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
        .max(500, { message: 'La descripción no puede exceder los 500 caracteres' }),
    date: z
        .date({
            error: "La fecha de inicio es requerida",
        }),
    endDate: z
        .date({
            error: "La fecha debe ser válida",
        })
        .optional(),
    location: z.string()
        .min(5, { message: 'La ubicación debe tener al menos 5 caracteres' })
        .max(200, { message: 'La ubicación no puede exceder los 200 caracteres' }),
    capacity: z
        .number({
            error: "La capacidad debe ser un número",
        })
        .min(1, { message: 'La capacidad debe ser al menos 1' })
        .optional(),
    createdBy: z.string(),
    createdAt: z.date(),
    updatedBy: z.string().optional(),
    updatedAt: z.date().optional(),
});

export type EventInput = z.infer<typeof EventSchema>;