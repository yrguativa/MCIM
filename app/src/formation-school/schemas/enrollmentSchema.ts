import { z } from "zod"

export const StudentEnrollmentSchema = z.object({
    id: z.string()
        .min(1)
        .default(crypto.randomUUID()),
    studentId: z.string()
        .min(1, {
            message: "El estudiante es obligatorio.",
        }),
    courseId: z.string()
        .min(1, {
            message: "La clase es obligatoria.",
        }),
    enrollmentDate: z.date()
        .default(() => new Date()),
    status: z.enum(["active", "completed", "withdrawn"])
        .default("active"),
    finalGrade: z.number()
        .optional(),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type StudentEnrollmentInput = z.infer<typeof StudentEnrollmentSchema>;
