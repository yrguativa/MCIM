import { z } from "zod"
import { CellAssistantSchema } from "./cellAssistantsSchema"
import { CellRecordSchema } from "./cellRecordsSchema";

export const CellSchema = z.object({
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
  assistants: z.array(CellAssistantSchema)
    .min(1, "At least one assistant is required."),
  records: z.array(CellRecordSchema),
})

export type Cell = z.infer<typeof CellSchema>;
