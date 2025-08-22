import { useTranslation } from 'react-i18next';

export const useSchemaTranslations = () => {
  const { t } = useTranslation();

  return {
    required: t('validation.required'),
    email: t('validation.email'),
    minLength: (min: number) => t('validation.minLength', { min }),
    maxLength: (max: number) => t('validation.maxLength', { max }),
    passwordMatch: t('validation.passwordMatch'),
    number: t('validation.number'),
    date: t('validation.date'),
    phone: t('validation.phone'),
  };
};

export const useEventValidations = () => {
  const { t } = useTranslation();

  return {
    name: {
      required: t('validation.required'),
      minLength: (min: number) => t('validation.minLength', { min }),
      maxLength: (max: number) => t('validation.maxLength', { max }),
    },
    description: {
      required: t('validation.required'),
      maxLength: (max: number) => t('validation.maxLength', { max }),
    },
    date: {
      required: t('validation.required'),
      date: t('validation.date'),
    },
    capacity: {
      required: t('validation.required'),
      number: t('validation.number'),
    },
  };
};
