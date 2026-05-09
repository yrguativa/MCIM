import { z } from "zod"

export const TeacherAssignmentSchema = z.object({
    id: z.string().min(1),
    teacherId: z.string()
        .min(1, {
            message: "El maestro es obligatorio.",
        }),
    type: z.enum(['teacher', 'tutor'])
        .default('teacher'),
    assignedDate: z.date()
        .default(() => new Date()),
    active: z.boolean()
        .default(true),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type TeacherAssignmentInput = z.infer<typeof TeacherAssignmentSchema>;
