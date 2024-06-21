import { z } from "zod"

export const CellAssistantSchema = z.object({
  date: z.string()
    .uuid()
    .default(crypto.randomUUID()),
  name: z.string()
    .min(2, {
      message: "El nombre del asistente a la celula es obligatorio.",
    }),
  attended: z.boolean().default(false)
})

export type Assistants = z.infer<typeof CellAssistantSchema>;
