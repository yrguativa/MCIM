import { z } from "zod"
import { UserSchema } from "./userSchema"


export const RegisterSchema = z.object({
    email: UserSchema.shape.email,
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    identification: UserSchema.shape.identification,
    ministryId: UserSchema.shape.ministryId,
    phoneNumber: UserSchema.shape.phoneNumber,
})

export type RegisterInput = z.infer<typeof RegisterSchema>