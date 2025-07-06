import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Схема валидации запроса
const resetPasswordSchema = z.object({
  phone: z.string().regex(/^7\d{10}$/),
});

// В реальном приложении здесь будет отправка SMS
// Для демонстрации просто возвращаем успешный ответ
export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса
    const body = await request.json();
    
    // Валидируем данные
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      );
    }
    
    const { phone } = validationResult.data;
    
    // В реальном приложении здесь будет проверка существования пользователя
    // и отправка SMS с кодом
    
    // Имитируем задержку отправки SMS
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при запросе сброса пароля:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}