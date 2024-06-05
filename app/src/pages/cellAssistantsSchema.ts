import { z } from "zod";

export const AssistantsSchema = z.object({
    name: z.string()
        .min(2, {
            message: "Nombre del asistente debe tener minimo 3 caracteres.",
        }),
    attended: z.boolean().default(false)
});