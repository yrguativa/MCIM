import { UserSchema } from "@/src/public/schemas/userSchema";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const RegisterEventSchema = () => {
    const { t } = useTranslation();

    return z.object({
        identification: z.string()
            .min(5, t('validation.minLength', { min: 5, field: 'identificación' }))
            .max(20, t('validation.minLength', { max: 20, field: 'identificación' })),
        name: z.string()
            .min(3, t('validation.minLength', { min: 3, field: 'nombre' }))
            .max(200, t('validation.maxLength', { max: 200, field: 'nombre' })),
        lastName: z.string()
            .min(3, t('validation.minLength', { min: 3, field: 'apellido' }))
            .max(200, t('validation.maxLength', { max: 200, field: 'apellido' })),
        ministryId: z.string()
            .min(1, "El ministerio es obligatorio"),

        phoneNumber: z.string()
            .min(1, "El número de teléfono es obligatorio")
            .regex(/^[0-9]+$/, "El número de teléfono solo debe contener números"),
    });
};

export type RegisterEventInput = z.infer<ReturnType<typeof RegisterEventSchema>>;

export const SearchDiscipleSchema = UserSchema.pick({
    identification: true,
})

export type SearchDiscipleInput = z.infer<typeof SearchDiscipleSchema>;