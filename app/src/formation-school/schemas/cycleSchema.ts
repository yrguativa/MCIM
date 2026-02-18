import { z } from "zod"

export const CycleSchema = z.object({
    id: z.string()
        .min(1, {
            message: "El id es obligatorio.",
        })
        .default(crypto.randomUUID()),
    name: z.string()
        .min(2, {
            message: "El nombre es obligatorio.",
        }),
    startDate: z.date({
        error: "La fecha de inicio es obligatoria.",
    }),
    endDate: z.date({
        error: "La fecha de fin es obligatoria.",
    }),
    active: z.boolean()
        .default(true),
    createdUser: z.string()
        .min(2, {
            message: "El usuario de creación es obligatorio.",
        }),
    createdDate: z.date({
        error: "La fecha de creación es obligatoria.",
    }),
})

export type CycleInput = z.infer<typeof CycleSchema>;
