import { z } from "zod"

export const CellAssistantSchema = z.object({
  disciple: z.string(),
  status: z.enum(['active', 'inactive']),
  createdDate: z.date(),
  createdUser: z.string(),
  updatedDate: z.date(),
  updatedUser: z.string(),
})

export const CellSchema = z.object({
  id: z.string()
    .default(crypto.randomUUID()),
  leader: z.string()
    .min(2, {
      message: "El lider de la celula es obligatorio.",
    }),
  host: z.string()
    .min(2, {
      message: "El anfitrion de la celula es obligatorio.",
    }),
  timoteo: z.string()
    .min(2, {
      message: "El timoteo de la celula es obligatorio.",
    }),
  neighborhood: z.number({
    error: "A neighborhood is required.",
  }),
  network: z.coerce.number({
    error: "A neighborhood is required.",
  }),
  address: z.string()
    .min(5, {
      message: "La dirección debe tener minimo 5 caracteres.",
    }),
  day: z.string().optional(),
  time: z.string().optional(),
  createdDate: z.date({
    error: "A date of birth is required.",
  }),
  createdUser: z.string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  assistants: z.array(CellAssistantSchema).default([]),
})

export type CellInput = z.infer<typeof CellSchema>;
