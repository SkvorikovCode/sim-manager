import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Функция для генерации хеша пароля (используется только для разработки)
async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Проверка хеша пароля при запуске (только для разработки)
async function verifyPasswordHash() {
  const password = 'password123';
  const hash = '$2b$10$j4Q4NiTmsHcN5.HWoprSZuJ/TUwTYW1z80pR0USFrwlEVv6fiEMii';
  const isValid = await bcrypt.compare(password, hash);
  console.log(`Проверка хеша пароля: ${isValid ? 'успешно' : 'неуспешно'}`);
}

// Вызываем проверку при запуске сервера
verifyPasswordHash();

// В реальном приложении здесь будет подключение к MongoDB
// Для демонстрации используем моковые данные
const mockUsers = [
  {
    id: '1',
    phone: '79001234567',
    passwordHash: '$2b$10$j4Q4NiTmsHcN5.HWoprSZuJ/TUwTYW1z80pR0USFrwlEVv6fiEMii', // 'password123'
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
  phone: z.string().transform(val => {
    // Удаляем все нецифровые символы
    const digits = val.replace(/\D/g, '');
    // Убедимся, что номер начинается с 7
    return digits.startsWith('7') ? digits : '7' + digits;
  }),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();
    console.log('Received login request:', body);
    
    // Валидируем данные
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      );
    }
    
    const { phone, password } = validationResult.data;
    console.log('Processed phone:', phone);
    
    // Ищем пользователя по номеру телефона
    const user = mockUsers.find(u => u.phone === phone);
    
    if (!user) {
      console.log('User not found for phone:', phone);
      return NextResponse.json(
        { error: 'Неверный номер телефона или пароль' },
        { status: 401 }
      );
    }
    
    // Проверяем пароль
    console.log('Проверка пароля для пользователя:', phone);
    console.log('Хеш пароля в базе:', user.passwordHash);
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Результат проверки пароля:', passwordValid);
    if (!passwordValid) {
      console.log('Invalid password for user:', phone);
      return NextResponse.json(
        { error: 'Неверный номер телефона или пароль' },
        { status: 401 }
      );
    }
    
    console.log('Login successful for user:', phone);
    
    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '15m' }
    );
    
    // Устанавливаем cookie
    const cookieStore = await cookies();
    cookieStore.set({
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