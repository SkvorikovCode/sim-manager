import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

// Схема валидации запроса
const loginSchema = z.object({
  phone: z.string().regex(/^7\d{10}$/),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();
    
    // Валидируем данные
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      );
    }
    
    const { phone, password } = validationResult.data;
    
    // Ищем пользователя по номеру телефона
    const user = mockUsers.find(u => u.phone === phone);
    
    // Если пользователь не найден или пароль неверный
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'Неверный номер телефона или пароль' },
        { status: 401 }
      );
    }
    
    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '15m' }
    );
    
    // Устанавливаем cookie
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 минут
      path: '/',
    });
    
    // Возвращаем данные пользователя (без пароля)
    const { passwordHash, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}