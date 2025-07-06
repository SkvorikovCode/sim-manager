'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button, Card, Input, PhoneInput } from '@/components/ui';
import { verifyCodeSchema, VerifyCodeData, resetPasswordSchema, ResetPasswordData } from '@/utils/validation';
import { verifyResetCode, resetPassword } from '@/utils/api';

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  
  // Получаем номер телефона из URL параметров
  const phoneParam = searchParams.get('phone') || '';
  
  // Форма для ввода кода
  const verifyForm = useForm<VerifyCodeData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      phone: phoneParam,
      code: '',
    },
  });
  
  // Форма для сброса пароля
  const resetForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      phone: phoneParam,
      code: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Обновляем значение телефона в форме, если оно изменилось в URL
  useEffect(() => {
    verifyForm.setValue('phone', phoneParam);
    resetForm.setValue('phone', phoneParam);
  }, [phoneParam, verifyForm, resetForm]);
  
  const phoneValue = verifyForm.watch('phone');
  const codeValue = verifyForm.watch('code');
  
  // Обработчик отправки формы верификации кода
  const onVerifySubmit = async (data: VerifyCodeData) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await verifyResetCode(data.phone, data.code);
      
      if (response.error) {
        setServerError(response.error);
        return;
      }
      
      if (response.data?.success) {
        setIsCodeVerified(true);
        resetForm.setValue('code', data.code);
      }
    } catch (error) {
      setServerError('Произошла ошибка при проверке кода. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработчик отправки формы сброса пароля
  const onResetSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await resetPassword(data.phone, data.code, data.password);
      
      if (response.error) {
        setServerError(response.error);
        return;
      }
      
      if (response.data?.success) {
        // Перенаправляем на страницу входа
        router.push('/login?reset=success');
      }
    } catch (error) {
      setServerError('Произошла ошибка при сбросе пароля. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Card className="mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isCodeVerified ? 'Создание нового пароля' : 'Подтверждение кода'}
          </h1>
          
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {serverError}
            </div>
          )}
          
          {!isCodeVerified ? (
            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              <p className="text-secondary-600 mb-4">
                Введите код подтверждения, который мы отправили на ваш номер телефона.
              </p>
              
              <PhoneInput
                label="Номер телефона"
                value={phoneValue}
                onChange={(value) => verifyForm.setValue('phone', value, { shouldValidate: true })}
                error={verifyForm.formState.errors.phone?.message}
                disabled={isLoading}
              />
              
              <Input
                label="Код подтверждения"
                type="text"
                error={verifyForm.formState.errors.code?.message}
                disabled={isLoading}
                {...verifyForm.register('code')}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Link href="/reset-password">
                  <Button variant="secondary" fullWidth type="button" disabled={isLoading}>
                    Назад
                  </Button>
                </Link>
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isLoading}
                >
                  Подтвердить
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <p className="text-secondary-600 mb-4">
                Создайте новый пароль для вашей учетной записи.
              </p>
              
              <Input
                label="Новый пароль"
                type="password"
                error={resetForm.formState.errors.password?.message}
                disabled={isLoading}
                {...resetForm.register('password')}
              />
              
              <Input
                label="Подтверждение пароля"
                type="password"
                error={resetForm.formState.errors.confirmPassword?.message}
                disabled={isLoading}
                {...resetForm.register('confirmPassword')}
              />
              
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
              >
                Сохранить новый пароль
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}