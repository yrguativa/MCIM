import { z } from "zod";
import { CellAssistantSchema } from "./cellAssistantsSchema";

export const CellRecordSchema = z.object({
  date: z.date({
    error: "La fecha de la celula es obligatoria.",
  }),
  topic: z.string()
    .min(2, {
      message: "El tema de la celula es obligatorio.",
    }),
  mode: z.enum(["presencial", "virtual"], {
    error: "La modalidad de la celula es obligatoria.",
  }),
  location: z.string().optional(),
  leader: z.string().optional(),
  createdUser: z.string()
    .min(2, {
      message: "El usuario de la celula es obligatorio.",
    }),
  assistants: z.array(CellAssistantSchema)
    .min(2, "La celula debe tener 2 almenos dos asistentes."),
}).refine(
  (data) => data.mode !== "presencial" || (data.location && data.location.trim().length > 0),
  { message: "La ubicación es obligatoria para células presenciales.", path: ["location"] }
);

export type CellRecordInput = z.infer<typeof CellRecordSchema>;
