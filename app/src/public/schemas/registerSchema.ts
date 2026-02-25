import { z } from "zod"

export const RegisterSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es obligatorio")
        .email("El correo electrónico no es válido"),
    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string()
        .min(1, "Debe confirmar la contraseña"),
    identification: z.string()
        .min(1, "El número de identificación es obligatorio")
        .min(5, "La identificación debe tener al menos 5 dígitos")
        .max(20, "La identificación no puede tener más de 20 dígitos")
        .regex(/^[0-9]+$/, "La identificación solo debe contener números"),
    ministryId: z.string()
        .min(1, "El ministerio es obligatorio"),
    phoneNumber: z.string()
        .optional()
        .refine((val) => !val || /^[0-9]+$/.test(val), {
            message: "El número de teléfono solo debe contener números"
        }),
    name: z.string().optional(),
    lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof RegisterSchema>