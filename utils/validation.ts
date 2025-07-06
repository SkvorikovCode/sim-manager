import { z } from 'zod';

export const phoneRegex = /^7\d{10}$/;

export const loginSchema = z.object({
  phone: z.string()
    .regex(phoneRegex, 'Введите корректный номер телефона в формате +7 XXX XXX-XX-XX')
    .transform(val => {
      // Удаляем все нецифровые символы
      const digits = val.replace(/\D/g, '');
      // Убедимся, что номер начинается с 7
      return digits.startsWith('7') ? digits : '7' + digits;
    }),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль не должен превышать 50 символов'),
});

export const resetPasswordRequestSchema = z.object({
  phone: z.string()
    .regex(phoneRegex, 'Введите корректный номер телефона в формате +7 XXX XXX-XX-XX')
    .transform(val => val.replace(/\D/g, '')),
});

export const verifyCodeSchema = z.object({
  phone: z.string()
    .regex(phoneRegex, 'Введите корректный номер телефона')
    .transform(val => val.replace(/\D/g, '')),
  code: z.string()
    .length(6, 'Код должен содержать 6 цифр')
    .regex(/^\d+$/, 'Код должен содержать только цифры'),
});

export const resetPasswordSchema = z.object({
  phone: z.string()
    .regex(phoneRegex, 'Введите корректный номер телефона')
    .transform(val => val.replace(/\D/g, '')),
  code: z.string()
    .length(6, 'Код должен содержать 6 цифр')
    .regex(/^\d+$/, 'Код должен содержать только цифры'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль не должен превышать 50 символов'),
  confirmPassword: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordRequestData = z.infer<typeof resetPasswordRequestSchema>;
export type VerifyCodeData = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;