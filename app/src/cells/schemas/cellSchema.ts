import { z } from "zod"

export const CellSchema = z.object({
  id: z.string()
    .uuid()
    .default(crypto.randomUUID()),
  leader: z.string()
    .min(2, {
      message: "El lider de la celula es obligatorio.",
    }),
  host: z.string()
    .min(2, {
      message: "El anfitrion de la celula es obligatorio.",
    }),
  neighborhood: z.number({
    required_error: "A neighborhood is required.",
  }),
  network: z.coerce.number({
    required_error: "A neighborhood is required.",
  }),
  address: z.string()
    .min(5, {
      message: "La dirección debe tener minimo 5 caracteres.",
    }),
  createdDate: z.date({
    required_error: "A date of birth is required.",
  }),
  createdUser: z.string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  // assistants: z.array(CellAssistantSchema)
  //   .min(1, "At least one assistant is required."),
  // records: z.array(CellRecordSchema),
})

export type Cell = z.infer<typeof CellSchema>;
