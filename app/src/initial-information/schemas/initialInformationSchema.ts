import { z } from "zod";

export const createInitialInformationSchema = (t: (key: string, options?: Record<string, unknown>) => string) => {
  const currentYear = new Date().getFullYear();

  return z
    .object({
      name: z
        .string()
        .min(1, t("initialInformation.validation.namesRequired"))
        .max(150, t("initialInformation.validation.nameMaxLength")),
      lastName: z
        .string()
        .min(1, t("initialInformation.validation.lastNamesRequired"))
        .max(150, t("initialInformation.validation.lastNameMaxLength")),
      email: z
        .string()
        .email(t("initialInformation.validation.emailInvalid"))
        .max(254, t("initialInformation.validation.emailMaxLength"))
        .optional()
        .or(z.literal("")),
      phone: z
        .string()
        .min(7, t("initialInformation.validation.phoneMin"))
        .regex(/^[0-9]+$/, t("initialInformation.validation.phoneNumeric")),
      identificationType: z.enum(
        ["CC", "TI", "CE", "PPT", "PASSPORT", "OTHER"],
        {
          error: t("initialInformation.validation.identificationTypeRequired"),
        },
      ),
      identification: z
        .string()
        .min(5, t("initialInformation.validation.identificationMin"))
        .max(20, t("initialInformation.validation.identificationMax"))
        .regex(
          /^[0-9]+$/,
          t("initialInformation.validation.identificationNumeric"),
        ),

      nationality: z.enum(["COLOMBIAN", "VENEZUELAN", "FOREIGN"], {
        error: t("initialInformation.validation.nationalityRequired"),
      }),
      gender: z.enum(["FEMALE", "MALE"], {
        error: t("initialInformation.validation.genderRequired"),
      }),
      maritalStatus: z
        .enum(["SINGLE", "MARRIED", "WIDOWED", "FREE_UNION", "DIVORCED"])
        .optional(),
      hasChildren: z.enum(["YES", "NO"], {
        error: t("initialInformation.validation.hasChildrenRequired"),
      }),
      childrenAttendChurch: z.enum(["YES", "NO"]).optional(),
      address: z
        .string()
        .min(5, t("initialInformation.validation.addressMin"))
        .max(300, t("initialInformation.validation.addressMaxLength")),
      housingComplex: z
        .string()
        .max(200, t("initialInformation.validation.housingComplexMaxLength"))
        .optional(),
      neighborhood: z
        .string()
        .min(1, t("initialInformation.validation.neighborhoodRequired")),
      municipality: z.enum(
        [
          "MOSQUERA",
          "FUNZA",
          "MADRID",
          "BOJACA",
          "FACATATIVA",
          "FONTIBON",
          "BOGOTA",
        ],
        { error: t("initialInformation.validation.municipalityRequired") },
      ),
      network: z.enum(["YOUTH", "PRE", "ROCAS", "MEN", "WOMEN"], {
        error: t("initialInformation.validation.networkRequired"),
      }),
      birthDate: z.date({
        message: t("initialInformation.validation.birthDateRequired"),
      }),

      ministryId: z
        .string()
        .min(1, t("initialInformation.validation.ministryRequired")),
      directLeaderId: z.string().optional(),
      yearArrivedAtChurch: z
        .string()
        .regex(/^\d{4}$/, t("initialInformation.validation.yearArrivedFormat"))
        .refine(
          (val) => {
            const year = parseInt(val);
            return year >= 1900 && year <= currentYear;
          },
          {
            message: t("initialInformation.validation.yearRange", {
              currentYear,
            }),
          },
        ),
      hasAttendedEncounter: z.enum(["YES", "NO"], {
        error: t("initialInformation.validation.hasAttendedEncounterRequired"),
      }),
      yearAttendedEncounter: z
        .string()
        .optional()
        .refine(
          (val) => !val || (parseInt(val) >= 1900 && parseInt(val) <= currentYear),
          {
            message: t("initialInformation.validation.yearRange", {
              currentYear,
            }),
          },
        ),
      hasRepeatedEncounter: z.enum(["YES", "NO"]).optional(),
      hasAttendedReencounter: z.enum(["YES", "NO"], {
        error: t(
          "initialInformation.validation.hasAttendedReencounterRequired",
        ),
      }),
      yearAttendedReencounter: z
        .string()
        .optional()
        .refine(
          (val) => !val || (parseInt(val) >= 1900 && parseInt(val) <= currentYear),
          {
            message: t("initialInformation.validation.yearRange", {
              currentYear,
            }),
          },
        ),
      baptizedAtMCI: z.enum(["YES", "NO"], {
        error: t("initialInformation.validation.baptizedRequired"),
      }),
      isLeader: z.enum(["YES", "NO"]).optional(),
      generation: z.enum(["12", "144", "1728", "20736", "248832", "2985984"], {
        error: t("initialInformation.validation.generationRequired"),
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
        {
          error: t(
            "initialInformation.validation.formationSchoolLevelRequired",
          ),
        },
      ),

      cellAddress: z.string().optional(),
      cellNeighborhood: z.number().optional(),
      cellDay: z.string().optional(),
      cellTime: z.string().optional(),
      cellHost: z.string().optional(),
      cellTimoteo: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.hasChildren === "YES" &&
        (!data.childrenAttendChurch ||
          data.childrenAttendChurch === undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["childrenAttendChurch"],
          message: t(
            "initialInformation.validation.childrenAttendChurchRequired",
          ),
        });
      }

      if (data.hasAttendedEncounter === "YES") {
        if (!data.yearAttendedEncounter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["yearAttendedEncounter"],
            message: t(
              "initialInformation.validation.yearAttendedEncounterRequired",
            ),
          });
        }
        if (!data.hasRepeatedEncounter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["hasRepeatedEncounter"],
            message: t(
              "initialInformation.validation.hasRepeatedEncounterRequired",
            ),
          });
        }
      }

      if (
        data.hasAttendedReencounter === "YES" &&
        !data.yearAttendedReencounter
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["yearAttendedReencounter"],
          message: t(
            "initialInformation.validation.yearAttendedReencounterRequired",
          ),
        });
      }
    });
};

export type InitialInformationInput = z.infer<
  ReturnType<typeof createInitialInformationSchema>
>;
