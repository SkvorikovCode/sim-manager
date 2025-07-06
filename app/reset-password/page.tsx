'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button, Card, PhoneInput } from '@/components/ui';
import { resetPasswordRequestSchema, ResetPasswordRequestData } from '@/utils/validation';
import { requestPasswordReset } from '@/utils/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  
  const { handleSubmit, formState: { errors }, setValue, watch } = useForm<ResetPasswordRequestData>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      phone: '',
    },
  });
  
  const phoneValue = watch('phone');
  
  const onSubmit = async (data: ResetPasswordRequestData) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await requestPasswordReset(data.phone);
      
      if (response.error) {
        setServerError(response.error);
        return;
      }
      
      if (response.data?.success) {
        setIsCodeSent(true);
        // Перенаправляем на страницу ввода кода
        router.push(`/verify-code?phone=${data.phone}`);
      }
    } catch (error) {
      setServerError('Произошла ошибка при отправке запроса. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Card className="mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">Восстановление пароля</h1>
          
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {serverError}
            </div>
          )}
          
          {isCodeSent ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" role="alert">
              Код подтверждения отправлен на ваш номер телефона.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-secondary-600 mb-4">
                Введите номер телефона, и мы отправим вам SMS с кодом для восстановления пароля.
              </p>
              
              <PhoneInput
                label="Номер телефона"
                value={phoneValue}
                onChange={(value) => setValue('phone', value, { shouldValidate: true })}
                error={errors.phone?.message}
                disabled={isLoading}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Link href="/login">
                  <Button variant="secondary" fullWidth type="button" disabled={isLoading}>
                    Назад
                  </Button>
                </Link>
                
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isLoading}
                >
                  Отправить код
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}