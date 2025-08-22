import { z } from "zod"

export const UserSchema = z.object({
    email: z.string()
        .email("El correo electrónico no es válido")
        .min(1, "El correo electrónico es obligatorio"),

    password: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .optional(),

    identification: z.string()
        .min(1, "El número de identificación es obligatorio")
        .regex(/^[0-9]+$/, "El número de teléfono solo debe contener números"),

    ministryId: z.string()
        .min(1, "El ministerio es obligatorio"),

    phoneNumber: z.string()
        .min(1, "El número de teléfono es obligatorio")
        .regex(/^[0-9]+$/, "El número de teléfono solo debe contener números"),

    displayName: z.string().optional(),

    photoURL: z.string().url().optional(),

    authProvider: z.enum(["email", "google", "apple"]),
})

export type User = z.infer<typeof UserSchema>;

export type UserState = User & {
    id: string;
}