import { z } from "zod"

export const DiscipleSchema = z.object({
    id: z.string()
        .min(1, {
            message: "El id es obligatorio.",
        })
        .default(crypto.randomUUID()),
    identification: z.coerce
        .number({
            error: "La identificación no es un número valido.",
        })
        .optional()
        .refine((val) => val !== undefined, {
            message: "La identificación es obligatoria.",
        }),
    name: z.string()
        .min(2, {
            message: "Los nombres del discipulo es obligatorio.",
        }),
    lastName: z.string()
        .min(2, {
            message: "Los apellidos del discipulo son obligatorios.",
        }),
    number: z.coerce.number({
        error: "A telefono is required.",
    }).optional(),

    address: z.string()
        .min(5, {
            message: "La dirección debe tener minimo 5 caracteres.",
        }).optional(),
    email: z.string()
        .min(5, {
            message: "El correo debe tener minimo 5 caracteres.",
        })
        .email("El correo no es valido").optional(),
    birthday: z.date({
        error: "La fecha de nacimiento es obligatoria.",
    })
        .optional(),
    ministryId: z.string()
        .min(2, {
            message: "El ministerio es obligatorio.",
        }),
    network: z.string()
        .optional(),
    status: z.string()
        .optional(),
    createdUser: z.string()
        .min(2, {
            message: "El usuario de creación es obligatorio.",
        }),
    createdDate: z.date({
        error: "La fecha de creación es obligatoria.",
    }),
})

export type DiscipleInput = z.infer<typeof DiscipleSchema>;
