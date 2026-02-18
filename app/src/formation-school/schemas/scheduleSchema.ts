import { z } from "zod"

export const ScheduleSchema = z.object({
    id: z.string()
        .min(1),
    dayOfWeek: z
        .number()
        .min(0)
        .max(6, {
            message: "El día debe estar entre 0 (domingo) y 6 (sábado).",
        }),
    startTime: z.string()
        .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
            message: "La hora de inicio debe tener formato HH:MM",
        }),
    endTime: z.string()
        .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, {
            message: "La hora de fin debe tener formato HH:MM",
        }),
    courseId: z.string()
        .optional(),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
}).refine((data) => data.startTime < data.endTime, {
    message: "La hora de inicio debe ser menor que la hora de fin.",
    path: ["startTime"],
})

export type ScheduleInput = z.infer<typeof ScheduleSchema>;
