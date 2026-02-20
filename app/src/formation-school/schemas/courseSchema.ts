import { z } from "zod"

export const CourseSchema = z.object({
    id: z.string().min(1),
    levelId: z.string()
        .min(1, {
            message: "El nivel es obligatorio.",
        }),
    teacherId: z.string()
        .min(1, {
            message: "El maestro es obligatorio.",
        }),
    classroomId: z.string()
        .min(1, {
            message: "El salón es obligatorio.",
        }),
    scheduleId: z.string()
        .min(1, {
            message: "El horario es obligatorio.",
        }),
    cycleId: z.string()
        .min(1, {
            message: "El ciclo es obligatorio.",
        }),
    type: z.enum(['vision', 'doctrina'])
        .optional(),
    qrCode: z.string()
        .optional(),
    qrExpiration: z.date()
        .optional(),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type CourseInput = z.infer<typeof CourseSchema>;
