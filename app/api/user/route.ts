import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// В реальном приложении здесь будет подключение к MongoDB
// Для демонстрации используем моковые данные
const mockUsers = [
  {
    id: '1',
    phone: '79001234567',
    passwordHash: '$2a$10$XQtJ5vMq5XB8LE.0yjxT5.HwUVCcO8GgJqpPMZOWgRpXz7nR5zKlG', // 'password123'
    balance: 542,
    tariff: {
      id: '1',
      name: 'Безлимит 50 Мбит/с',
      price: 450,
    },
    nextPaymentDate: '2025-07-15T00:00:00.000Z',
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из cookie
    const token = cookies().get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }
    
    // Верифицируем токен
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    } catch (error) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }
    
    // Получаем ID пользователя из токена
    const userId = (decodedToken as { userId: string }).userId;
    
    // Ищем пользователя по ID
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Возвращаем данные пользователя (без пароля)
    const { passwordHash, ...userWithoutPassword } = user;
    
    // Имитируем случайное изменение баланса для демонстрации
    const randomBalance = Math.floor(user.balance + Math.random() * 100);
    
    return NextResponse.json({
      ...userWithoutPassword,
      balance: randomBalance,
    });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}