import { z } from "zod"

export const StudentCourseHistorySchema = z.object({
    id: z.string()
        .min(1)
        .default(crypto.randomUUID()),
    studentId: z.string()
        .min(1, {
            message: "El estudiante es obligatorio.",
        }),
    courseId: z.string()
        .min(1, {
            message: "El curso es obligatorio.",
        }),
    enrollmentDate: z.date(),
    completionDate: z.date().optional(),
    finalGrade: z.number().optional(),
    status: z.enum(['in_progress', 'completed', 'withdrawn']),
    promotedToNextLevel: z.boolean().default(false),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type StudentCourseHistoryInput = z.infer<typeof StudentCourseHistorySchema>;
