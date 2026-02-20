import { z } from "zod"

export const LevelSchema = z.object({
    id: z.string().min(1),
    name: z.string()
        .min(2, {
            message: "El nombre es obligatorio.",
        }),
    description: z.string()
        .optional(),
    order: z.coerce
        .number()
        .min(1, {
            message: "El orden debe ser al menos 1.",
        }),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type LevelInput = z.infer<typeof LevelSchema>;
