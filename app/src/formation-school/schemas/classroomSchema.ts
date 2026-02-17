import { z } from "zod"

export const ClassroomSchema = z.object({
    id: z.string()
        .min(1)
        .default(crypto.randomUUID()),
    name: z.string()
        .min(2, {
            message: "El nombre es obligatorio.",
        }),
    capacity: z.coerce
        .number()
        .min(1, {
            message: "La capacidad debe ser al menos 1.",
        }),
    location: z.string()
        .min(2, {
            message: "La ubicación es obligatoria.",
        }),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type ClassroomInput = z.infer<typeof ClassroomSchema>;
