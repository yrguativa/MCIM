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
    identificationType: z.enum(["CC", "TI", "CE", "PPT", "PASSPORT", "OTHER"], {
        error: "El tipo de identificación es obligatorio.",
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

    email: z.string()
        .min(5, {
            message: "El correo debe tener minimo 5 caracteres.",
        })
        .email("El correo no es valido").optional(),

    // Personal info
    nationality: z.enum(["COLOMBIAN", "VENEZUELAN", "FOREIGN"], {
        error: "La nacionalidad es obligatoria.",
    }).optional(),
    gender: z.enum(["FEMALE", "MALE"], {
        error: "El genero es obligatorio.",
    }).optional(),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "FREE_UNION", "DIVORCED"]).optional(),
    hasChildren: z.enum(["YES", "NO"]).optional(),
    childrenAttendChurch: z.enum(["YES", "NO"]).optional(),
    address: z.string().optional(),
    housingComplex: z.string().optional(),
    neighborhood: z.string().optional(),
    municipality: z.enum(["MOSQUERA", "FUNZA", "MADRID", "BOJACA", "FACATATIVA", "FONTIBON", "BOGOTA"]).optional(),
    network: z.string().optional(),
    birthDate: z.date().optional(),

    // Church info
    ministryId: z.string()
        .min(2, {
            message: "El ministerio es obligatorio.",
        }),
    directLeaderId: z.string().optional(),
    yearArrivedAtChurch: z.string().optional(),
    hasAttendedEncounter: z.enum(["YES", "NO"]).optional(),
    yearAttendedEncounter: z.string().optional(),
    hasRepeatedEncounter: z.enum(["YES", "NO"]).optional(),
    hasAttendedReencounter: z.enum(["YES", "NO"]).optional(),
    yearAttendedReencounter: z.string().optional(),
    baptizedAtMCI: z.enum(["YES", "NO"]).optional(),
    isLeader: z.enum(["YES", "NO"]).optional(),
    generation: z.enum(["12", "144", "1728", "20736", "248832", "2985984"]).optional(),
    formationSchoolLevel: z.enum(["BASIC_1", "BASIC_2", "BASIC_3", "ADVANCED_1", "ADVANCED_2", "ADVANCED_3", "GRADUATE", "NOT_STARTED"]).optional(),

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
