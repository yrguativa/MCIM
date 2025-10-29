import { UserSchema } from "@/src/public/schemas/userSchema";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const RegisterEventSchema = () => {
    const { t } = useTranslation();

    return z.object({
        discipleId: z.string()
            .min(5, t('validation.minLength', { min: 5, field: 'discipleId' }))
            .max(20, t('validation.minLength', { max: 20, field: 'discipleId' })),
        eventId: z.string()
            .min(3, t('validation.minLength', { min: 3, field: 'eventId' }))
            .max(200, t('validation.maxLength', { max: 200, field: 'eventId' })),
    });
};

export type RegisterEventInput = z.infer<ReturnType<typeof RegisterEventSchema>>;

export const SearchDiscipleSchema = UserSchema.pick({
    identification: true,
})

export type SearchDiscipleInput = z.infer<typeof SearchDiscipleSchema>;