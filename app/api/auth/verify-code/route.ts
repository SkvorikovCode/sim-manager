import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Схема валидации запроса
const verifyCodeSchema = z.object({
  phone: z.string().regex(/^7\d{10}$/),
  code: z.string().length(6).regex(/^\d+$/),
});

// В реальном приложении здесь будет проверка кода в базе данных
// Для демонстрации просто проверяем, что код равен '123456'
export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();
    
    // Валидируем данные
    const validationResult = verifyCodeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      );
    }
    
    const { phone, code } = validationResult.data;
    
    // В реальном приложении здесь будет проверка кода в базе данных
    // Для демонстрации просто проверяем, что код равен '123456'
    if (code !== '123456') {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при проверке кода:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}