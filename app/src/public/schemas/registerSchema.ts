import { z } from "zod"
import { UserSchema } from "./userSchema"

export const RegisterSchema = UserSchema.pick({
    email: true,
    password: true,
    identification: true,
    ministryId: true,
    phoneNumber: true,
})

export type RegisterInput = z.infer<typeof RegisterSchema>