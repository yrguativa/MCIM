import { z } from "zod";

export const InitialInformationSchema = z
  .object({
    names: z.string().min(1, "initialInformation.validation.namesRequired"),
    lastNames: z.string().min(1, "initialInformation.validation.lastNamesRequired"),
    email: z
      .string()
      .email("initialInformation.validation.emailInvalid")
      .optional()
      .or(z.literal("")),
    phone: z.string().min(7, "initialInformation.validation.phoneMin"),
    identificationType: z.enum(["CC", "TI", "CE", "PPT", "PASSPORT", "OTHER"], {
      error: "initialInformation.validation.identificationTypeRequired",
    }),
    identification: z
      .string()
      .min(5, "initialInformation.validation.identificationMin")
      .max(20, "initialInformation.validation.identificationMax")
      .regex(/^[0-9]+$/, "initialInformation.validation.identificationNumeric"),

    nationality: z.enum(["COLOMBIAN", "VENEZUELAN", "FOREIGN"], {
      error: "initialInformation.validation.nationalityRequired",
    }),
    gender: z.enum(["FEMALE", "MALE"], {
      error: "initialInformation.validation.genderRequired",
    }),
    maritalStatus: z
      .enum(["SINGLE", "MARRIED", "WIDOWED", "FREE_UNION", "DIVORCED"])
      .optional(),
    hasChildren: z.enum(["YES", "NO"], {
      error: "initialInformation.validation.hasChildrenRequired",
    }),
    childrenAttendChurch: z.enum(["YES", "NO"]).optional(),
    address: z.string().min(5, "initialInformation.validation.addressMin"),
    housingComplex: z.string().optional(),
    neighborhood: z.string().min(1, "initialInformation.validation.neighborhoodRequired"),
    municipality: z.enum(
      ["MOSQUERA", "FUNZA", "MADRID", "BOJACA", "FACATATIVA", "FONTIBON", "BOGOTA"],
      { error: "initialInformation.validation.municipalityRequired" },
    ),
    network: z.enum(["YOUTH", "PRE", "ROCAS", "MEN", "WOMEN"], {
      error: "initialInformation.validation.networkRequired",
    }),
    birthDate: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "initialInformation.validation.birthDateFormat"),

    ministryId: z.string().min(1, "initialInformation.validation.ministryRequired"),
    directLeaderId: z.string().optional(),
    yearArrivedAtChurch: z
      .string()
      .regex(/^\d{4}$/, "initialInformation.validation.yearArrivedFormat"),
    hasAttendedEncounter: z.enum(["YES", "NO"], {
      error: "initialInformation.validation.hasAttendedEncounterRequired",
    }),
    yearAttendedEncounter: z.string().optional(),
    hasRepeatedEncounter: z.enum(["YES", "NO"]).optional(),
    hasAttendedReencounter: z.enum(["YES", "NO"], {
      error: "initialInformation.validation.hasAttendedReencounterRequired",
    }),
    yearAttendedReencounter: z.string().optional(),
    baptizedAtMCI: z.enum(["YES", "NO"], {
      error: "initialInformation.validation.baptizedRequired",
    }),
    isLeader: z.enum(["YES", "NO"]).optional(),
    generation: z.enum(["12", "144", "1728", "20736", "248832", "2985984"], {
      error: "initialInformation.validation.generationRequired",
    }),
    formationSchoolLevel: z.enum(
      [
        "BASIC_1",
        "BASIC_2",
        "BASIC_3",
        "ADVANCED_1",
        "ADVANCED_2",
        "ADVANCED_3",
        "GRADUATE",
        "NOT_STARTED",
      ],
      { error: "initialInformation.validation.formationSchoolLevelRequired" },
    ),
  })
  .superRefine((data, ctx) => {
    if (data.hasChildren === "YES" && (!data.childrenAttendChurch || data.childrenAttendChurch === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childrenAttendChurch"],
        message: "initialInformation.validation.childrenAttendChurchRequired",
      });
    }

    if (data.hasAttendedEncounter === "YES") {
      if (!data.yearAttendedEncounter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["yearAttendedEncounter"],
          message: "initialInformation.validation.yearAttendedEncounterRequired",
        });
      }
      if (!data.hasRepeatedEncounter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hasRepeatedEncounter"],
          message: "initialInformation.validation.hasRepeatedEncounterRequired",
        });
      }
    }

    if (data.hasAttendedReencounter === "YES" && !data.yearAttendedReencounter) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yearAttendedReencounter"],
        message: "initialInformation.validation.yearAttendedReencounterRequired",
      });
    }
  });

export type InitialInformationInput = z.infer<typeof InitialInformationSchema>;
