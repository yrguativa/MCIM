import { z } from "zod"

const LevelTypeSchema = z.enum(['vision', 'doctrina'])

export const LevelSchema = z.object({
    id: z.string()
        .min(1)
        .default(crypto.randomUUID()),
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
    type: LevelTypeSchema,
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type LevelInput = z.infer<typeof LevelSchema>;
