import { z } from "zod"

export const CycleSchema = z.object({
    id: z.string().min(1),
    name: z.string()
        .min(2, {
            message: "El nombre es obligatorio.",
        }),
    startDate: z.date(),
    endDate: z.date(),
    active: z.boolean(),
    requiredClasses: z.number().min(1).default(6),
    createdUser: z.string()
        .min(2),
    createdDate: z.date(),
})

export type CycleInput = z.infer<typeof CycleSchema>;
export type CycleFormData = Omit<CycleInput, 'startDate' | 'endDate'> & {
    startDate: Date;
    endDate: Date;
};
