import { z } from "zod"

export const LoginOtherDataSchema = z.object({
    identification: z.string()
        .min(1, "El número de identificación es obligatorio")
        .min(5, "La identificación debe tener al menos 5 dígitos")
        .max(20, "La identificación no puede tener más de 20 dígitos")
        .regex(/^[0-9]+$/, "La identificación solo debe contener números"),
    ministryId: z.string()
        .min(1, "El ministry es obligatorio"),
    phoneNumber: z.string()
        .optional()
        .refine((val) => !val || /^[0-9]+$/.test(val), {
            message: "El número de teléfono solo debe contener números"
        }),
})

export type LoginOtherDataInput = z.infer<typeof LoginOtherDataSchema>
