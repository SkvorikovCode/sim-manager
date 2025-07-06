'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { Button, Card, PhoneInput, Input } from '@/components/ui';
import { loginSchema, LoginFormData } from '@/utils/validation';
import { loginUser } from '@/utils/api';
import useUserStore from '@/store/useUserStore';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { setUser } = useUserStore();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });
  
  const phoneValue = watch('phone');
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await loginUser(data.phone, data.password);
      
      if (response.error) {
        setServerError(response.error);
        return;
      }
      
      if (response.data) {
        setUser(response.data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      setServerError('Произошла ошибка при входе. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Card className="mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">Вход в личный кабинет</h1>
          
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PhoneInput
              label="Номер телефона"
              value={phoneValue}
              onChange={(value) => setValue('phone', value, { shouldValidate: true })}
              error={errors.phone?.message}
              disabled={isLoading}
            />
            
            <Input
              label="Пароль"
              type="password"
              error={errors.password?.message}
              disabled={isLoading}
              {...register('password')}
            />
            
            <div className="flex justify-end">
              <Link 
                href="/reset-password"
                className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
            >
              Войти
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
            <p className="font-medium text-blue-800">Демо-данные для входа:</p>
            <p className="text-blue-700">Телефон: +7 900 123-45-67</p>
            <p className="text-blue-700">Пароль: password123</p>
          </div>
        </Card>
      </div>
    </div>
  );
}