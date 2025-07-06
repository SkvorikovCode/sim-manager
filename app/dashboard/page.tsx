'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, Button, InfoItem, Badge, Skeleton } from '@/components/ui';
import useUserStore from '@/store/useUserStore';
import { getUserData, logoutUser } from '@/utils/api';
import { formatMaskedPhone, formatCurrency, formatDate } from '@/utils/format';

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, isLoading, setLoading, setError, logout } = useUserStore();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  
  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        const response = await getUserData();
        
        if (response.error) {
          setError(response.error);
          return;
        }
        
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
    
    // Обновляем данные каждые 5 минут
    const intervalId = setInterval(fetchUserData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [setUser, setLoading, setError]);
  
  // Обработчик выхода из аккаунта
  const handleLogout = async () => {
    setIsLogoutLoading(true);
    
    try {
      await logoutUser();
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
    } finally {
      setIsLogoutLoading(false);
    }
  };
  
  // Обработчик пополнения баланса
  const handleTopUp = () => {
    // В реальном приложении здесь будет редирект на платежный шлюз
    window.open('https://payment-gateway.example.com', '_blank');
  };
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Личный кабинет</h1>
        
        {isLoading ? (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Загрузка данных...</h2>
            <div className="space-y-4">
              <Skeleton height="h-6" />
              <Skeleton height="h-6" />
              <Skeleton height="h-6" />
              <Skeleton height="h-6" />
              <Skeleton height="h-10" className="mt-6" />
            </div>
          </Card>
        ) : user ? (
          <>
            <Card className="mb-4">
              <h2 className="text-xl font-semibold">Ваш тариф</h2>
              <div className="mt-4 space-y-3 divide-y divide-secondary-200">
                <InfoItem label="Номер" value={formatMaskedPhone(user.phone)} />
                <InfoItem label="Баланс" value={formatCurrency(user.balance)} />
                <InfoItem label="Тариф" value={user.tariff.name} />
                <InfoItem 
                  label="Следующий платеж" 
                  value={formatDate(user.nextPaymentDate)} 
                />
                <InfoItem 
                  label="Статус" 
                  value={<Badge active={user.isActive} />} 
                />
              </div>
              <Button 
                onClick={handleTopUp} 
                className="mt-6 w-full"
              >
                Пополнить баланс
              </Button>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                variant="secondary" 
                onClick={handleLogout}
                isLoading={isLogoutLoading}
              >
                Выйти из аккаунта
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">Ошибка загрузки данных</p>
              <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}