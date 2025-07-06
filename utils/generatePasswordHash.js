const bcrypt = require('bcryptjs');

/**
 * Скрипт для генерации хеша пароля
 * Запуск: node utils/generatePasswordHash.js password123
 */
async function generateHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.error('Пожалуйста, укажите пароль в качестве аргумента');
    process.exit(1);
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('Пароль:', password);
    console.log('Хеш пароля:', hash);
    
    // Проверка хеша
    const isValid = await bcrypt.compare(password, hash);
    console.log('Проверка хеша:', isValid ? 'успешно' : 'неуспешно');
  } catch (error) {
    console.error('Ошибка при генерации хеша:', error);
  }
}

generateHash(); 