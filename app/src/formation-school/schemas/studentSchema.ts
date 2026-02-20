import { z } from "zod"

export const StudentSchema = z.object({
    id: z.string().min(1),
    discipleId: z.string()
        .min(1, {
            message: "El discípulo es obligatorio.",
        }),
    currentLevelId: z.string()
        .min(1, {
            message: "El nivel actual es obligatorio.",
        }),
    status: z.enum(['active', 'inactive']),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type StudentInput = z.infer<typeof StudentSchema>;
