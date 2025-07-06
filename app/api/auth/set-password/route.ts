import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Схема валидации запроса
const setPasswordSchema = z.object({
  phone: z.string().regex(/^7\d{10}$/),
  code: z.string().length(6).regex(/^\d+$/),
  newPassword: z.string().min(6).max(50),
});

// В реальном приложении здесь будет подключение к MongoDB
// Для демонстрации используем моковые данные из login/route.ts
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

export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();
    
    // Валидируем данные
    const validationResult = setPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      );
    }
    
    const { phone, code, newPassword } = validationResult.data;
    
    // В реальном приложении здесь будет проверка кода в базе данных
    // Для демонстрации просто проверяем, что код равен '123456'
    if (code !== '123456') {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }
    
    // Ищем пользователя по номеру телефона
    const userIndex = mockUsers.findIndex(u => u.phone === phone);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // В реальном приложении здесь будет обновление пароля в базе данных
    // Для демонстрации просто обновляем моковые данные
    mockUsers[userIndex].passwordHash = hashedPassword;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при установке нового пароля:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}