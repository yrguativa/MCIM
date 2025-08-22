import { z } from "zod";
import { CellAssistantSchema } from "./cellAssistantsSchema";

export const CellRecordSchema = z.object({
  date: z.date({
    required_error: "La fecha de la celula es obligatoria.",
  }),
  topic: z.string()
    .min(2, {
      message: "El tema de la celula es obligatorio.",
    }),
  createdUser: z.string()
    .min(2, {
      message: "El usuario de la celula es obligatorio.",
    }),
  assistants: z.array(CellAssistantSchema)
    .min(2, "La celula debe tener 2 almenos dos asistentes."),
});

export type CellRecordInput = z.infer<typeof CellRecordSchema>;
