import { z } from "zod";

export const MinistrySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    parentMinistryId: z.string().nullable().optional(),
    leaderId: z.string().nullable().optional(),
    createdUserId: z.string().optional(),
    createdDate: z.date().optional(),
    active: z.boolean().default(true),
});
