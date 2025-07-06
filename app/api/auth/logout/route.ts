import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Удаляем cookie с токеном
    cookies().delete('auth-token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при выходе из аккаунта:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}