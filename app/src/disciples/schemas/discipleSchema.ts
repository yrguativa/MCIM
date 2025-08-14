import { z } from "zod"

export const DiscipleSchema = z.object({
    id: z.string()
        .min(1, {
            message: "El id es obligatorio.",
        })
        .default(crypto.randomUUID()),
    identification: z.coerce.number({
        required_error: "La identificación es obligatoria.",
        invalid_type_error: "La identificación no es un número valido.",
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
        invalid_type_error: "A telefono is required.",
    }).optional(),

    address: z.string()
        .min(5, {
            message: "La dirección debe tener minimo 5 caracteres.",
        }).optional(),
    email: z.string()
        .min(5, {
            message: "La dirección debe tener minimo 5 caracteres.",
        })
        .email("El correo no es valido").optional(),
    birthday: z.date({
        required_error: "La fecha de nacimiento es obligatoria.",
    }).optional(),
    ministryId: z.string({
        required_error: "El ministerio es obligatorio.",
    }),
    createdUser: z.string()
        .min(2, {
            message: "El usuario de creación es obligatorio.",
        }),
    createdDate: z.date({
        required_error: "La fecha de creación es obligatoria.",
    }),
})

export type Disciple = z.infer<typeof DiscipleSchema>;
