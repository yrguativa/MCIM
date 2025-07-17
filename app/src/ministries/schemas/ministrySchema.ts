import { z } from "zod";

export const MinistrySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    parentMinistryId: z.string().nullable().optional(),
    leader: z.string().nullable().optional(),
    createdUser: z.string().min(1, "El usuario de creación es requerido"),
    createdDate: z.date().optional(),
    active: z.boolean().default(true),
});
