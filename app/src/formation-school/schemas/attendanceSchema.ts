import { z } from "zod"

export const AttendanceSchema = z.object({
    id: z.string().min(1),
    studentEnrollmentId: z.string()
        .min(1, {
            message: "La inscripción es obligatoria.",
        }),
    courseId: z.string()
        .min(1, {
            message: "La clase es obligatoria.",
        }),
    attended: z.boolean()
        .default(true),
    attendanceDate: z.date()
        .default(() => new Date()),
    notes: z.string()
        .optional(),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type AttendanceInput = z.infer<typeof AttendanceSchema>;
