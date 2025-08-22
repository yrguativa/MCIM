import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string()
        .email("El correo electrónico no es válido")
        .min(1, "El correo electrónico es obligatorio"),

    password: z.string()
        .min(1, "La contraseña es obligatoria"),
})

export type LoginInput = z.infer<typeof LoginSchema>