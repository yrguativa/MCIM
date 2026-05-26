import { z } from "zod"

export const createDiscipleSchema = (t: (key: string) => string) => z.object({
    id: z.string()
        .min(1, {
            message: t("disciples.validation.idRequired"),
        })
        .default(crypto.randomUUID()),
    identification: z.coerce
        .number({
            error: t("disciples.validation.identificationInvalid"),
        })
        .optional()
        .refine((val) => val !== undefined, {
            message: t("disciples.validation.identificationRequired"),
        }),
    identificationType: z.enum(["CC", "TI", "CE", "PPT", "PASSPORT", "OTHER"], {
        error: t("disciples.validation.identificationTypeRequired"),
    }),
    name: z.string()
        .min(2, {
            message: t("disciples.validation.nameRequired"),
        }),
    lastName: z.string()
        .min(2, {
            message: t("disciples.validation.lastNameRequired"),
        }),
    number: z.coerce.number({
        error: t("disciples.validation.phoneRequired"),
    }).optional(),

    email: z.string()
        .min(5, {
            message: t("disciples.validation.emailMinLength"),
        })
        .email(t("disciples.validation.emailInvalid")).optional(),

    // Personal info
    nationality: z.enum(["COLOMBIAN", "VENEZUELAN", "FOREIGN"], {
        error: t("disciples.validation.nationalityRequired"),
    }).optional(),
    gender: z.enum(["FEMALE", "MALE"], {
        error: t("disciples.validation.genderRequired"),
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
            message: t("disciples.validation.ministryRequired"),
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
    generation: z.enum(["YES", "NO"]).optional(),
    rh: z.enum(["O_POSITIVE", "O_NEGATIVE", "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"]).optional(),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    formationSchoolLevel: z.enum(["BASIC_1", "BASIC_2", "BASIC_3", "ADVANCED_1", "ADVANCED_2", "ADVANCED_3", "GRADUATE", "NOT_STARTED"]).optional(),

    status: z.string()
        .optional(),
    createdUser: z.string()
        .min(2, {
            message: t("disciples.validation.createdUserRequired"),
        }),
    createdDate: z.date({
        error: t("disciples.validation.createdDateRequired"),
    }),
})

export type DiscipleInput = z.infer<ReturnType<typeof createDiscipleSchema>>;
