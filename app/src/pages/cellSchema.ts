import { z } from "zod"
import { AssistantsSchema } from "./cellAssistantsSchema"
import { cellRecordSchema } from "./cellRecordsSchema";

export const cellSchema = z.object({
  id: z.string()
    .uuid()
    .default(crypto.randomUUID()),
  leader: z.string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  createdDate: z.date({
    required_error: "A date of birth is required.",
  }),
  createdUser: z.string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  assistants: z.array(AssistantsSchema),
  records: z.array(cellRecordSchema)
})

export type Cell = z.infer<typeof cellSchema>;
