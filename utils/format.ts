/**
 * Форматирует номер телефона в маскированный вид: +7 ••• •••-XX-XX
 */
export function formatMaskedPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone;
  
  // Убираем все нецифровые символы
  const digits = phone.replace(/\D/g, '');
  
  // Форматируем номер с маской
  return `+7 ••• •••-${digits.substring(9, 11)}-${digits.substring(11, 13)}`;
}

/**
 * Форматирует номер телефона в виде: +7 XXX XXX-XX-XX
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Убираем все нецифровые символы
  const digits = phone.replace(/\D/g, '');
  
  // Если номер начинается не с 7, добавляем 7 в начало
  const normalizedDigits = digits.startsWith('7') ? digits : `7${digits}`;
  
  // Форматируем номер
  if (normalizedDigits.length < 2) return `+${normalizedDigits}`;
  if (normalizedDigits.length < 5) return `+${normalizedDigits.substring(0, 1)} ${normalizedDigits.substring(1)}`;
  if (normalizedDigits.length < 8) return `+${normalizedDigits.substring(0, 1)} ${normalizedDigits.substring(1, 4)} ${normalizedDigits.substring(4)}`;
  if (normalizedDigits.length < 10) return `+${normalizedDigits.substring(0, 1)} ${normalizedDigits.substring(1, 4)} ${normalizedDigits.substring(4, 7)}-${normalizedDigits.substring(7)}`;
  
  return `+${normalizedDigits.substring(0, 1)} ${normalizedDigits.substring(1, 4)} ${normalizedDigits.substring(4, 7)}-${normalizedDigits.substring(7, 9)}-${normalizedDigits.substring(9, 11)}`;
}

/**
 * Форматирует сумму в рублях: 542 ₽
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`;
}

/**
 * Форматирует дату в формате: 15.07.2025
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}