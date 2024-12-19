import { number, z } from "zod"

export const CellSchema = z.object({
    id: z.string()
        .uuid()
        .default(crypto.randomUUID()),
    name: z.string()
        .min(2, {
            message: "Los nombres del discipulo es obligatorio.",
        }),
    lastName: z.string()
        .min(2, {
            message: "Los apellidos del discipulo son obligatorios.",
        }),
    number: z.number({
        required_error: "A neighborhood is required.",
    }),
    identification: z.coerce.number({
        required_error: "A neighborhood is required.",
    }),
    address: z.string()
        .min(5, {
            message: "La dirección debe tener minimo 5 caracteres.",
        }),
    dateBorht: z.date({
        required_error: "A date of birth is required.",
    }),
    createdUser: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
})

export type Cell = z.infer<typeof CellSchema>;
