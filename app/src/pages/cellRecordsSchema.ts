
import { z } from "zod"
import { AssistantsSchema } from "./cellAssistantsSchema"

export const cellRecordSchema = z.object({
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

export type CellRecord = z.infer<typeof cellRecordSchema>;
