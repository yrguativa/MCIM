import { z } from "zod"
import { UserSchema } from "./userSchema"

export const LoginOtherDataSchema = UserSchema.pick({
    identification: true,
    ministryId: true,
    phoneNumber: true,
})

export type LoginOtherDataInput = z.infer<typeof LoginOtherDataSchema>