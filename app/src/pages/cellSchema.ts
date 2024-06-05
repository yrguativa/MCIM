import { z } from "zod"
import { AssistantsSchema } from "./cellAssistantsSchema"

export const cellSchema = z.object({
    cell: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    leader: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    date: z.date({
        required_error: "A date of birth is required.",
    }),
    topic: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    createUser: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    assistants: z.array(AssistantsSchema),
})
