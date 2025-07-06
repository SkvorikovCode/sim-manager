### Техническое задание: Личный кабинет клиента (Next.js)  
**Цель**: Разработка минималистичного ЛК для управления интернет-услугами (4G + SIM)  

---

#### 1. Функциональные требования  
**1.1. Авторизация**  
- Вход по номеру телефона (формат `+7 XXX XXX-XX-XX`) и паролю  
- Восстановление доступа через SMS-код  
- Редирект авторизованных пользователей с `/login` на `/dashboard`

**1.2. Главная страница (`/dashboard`)**  
**Отображаемые данные**:  
- Маскированный номер: `+7 ••• •••-XX-XX`  
- Баланс в формате: `542 ₽` (обновляется без перезагрузки)  
- Название тарифа (пример: `Безлимит 50 Мбит/с`)  
- Дата оплаты: `Следующий платеж: 15.07.2025`  
- Статус: `Активен`/`Приостановлен` (цветовая индикация)  
- Кнопка **«Пополнить баланс»** → редирект на внешний платежный шлюз  

**1.3. Сессия и безопасность**  
- JWT-аутентификация с httpOnly cookies  
- Автоматический логаут после 15 мин неактивности  

---

#### 2. Технологический стек  
**Frontend**:  
- Next.js 14 (App Router)  
- React 18 + TypeScript  
- State management: Zustand (или Context API)  
- Стили: Tailwind CSS + Headless UI  
- Формы: React Hook Form  

**Backend**:  
- Next.js API Routes (Node.js)  
- БД: MongoDB
- Платежи: пока что заглушку, платежную систему выберем позже

**Инфраструктура**:  
- Хостинг: Vercel  
- CI/CD: GitHub Actions  

---

#### 3. Особенности реализации Next.js  
**3.1. Роутинг**:  
```
app/
  ├── login/
  │   └── page.tsx
  ├── dashboard/
  │   └── page.tsx  (protected route)
  └── api/
      ├── auth/
      │   ├── route.ts  (POST)
      ├── user/
      │   └── route.ts (GET)
      └── payments/
          └── route.ts (POST)
```

**3.2. Data Fetching**:  
- Данные пользователя: `getServerSideProps` в `/dashboard`  
- Кэширование баланса: 5 мин (stale-while-revalidate)  

**3.3. Безопасность**:  
- Защита API роутов: middleware с проверкой JWT  
- Валидация входящих данных: Zod  

---

#### 4. Дизайн-система  
**Компоненты**:  
- `<Card>` для блока информации  
- `<Skeleton>` для состояния загрузки  
- `<Button>` с вариантами: primary/secondary  

**Макет**:  
```jsx
// Пример dashboard/page.tsx
export default function Dashboard() {
  const { balance, tariff } = useUserData(); // Данные из API
  
  return (
    <main className="max-w-md mx-auto p-4">
      <Card>
        <h2 className="text-xl font-semibold">Ваш тариф</h2>
        <div className="mt-4 space-y-3">
          <InfoItem label="Номер" value="+7 ••• •••-**-**" />
          <InfoItem label="Баланс" value={`${balance} ₽`} />
          <InfoItem label="Тариф" value={tariff.name} />
          <InfoItem label="Статус" value={<Badge active={tariff.isActive} />} />
        </div>
        <Button 
          onClick={() => window.open(PAYMENT_URL)} 
          className="mt-6 w-full"
        >
          Пополнить баланс
        </Button>
      </Card>
    </main>
  )
}
```

---

#### 5. Требования к безопасности  
- Запрет CORS для API роутов кроме white-listed доменов  
- Rate Limiting: 10 запросов/мин на `/api/auth`  
- Все секреты (JWT_SECRET, DB_URL) в .env → Vercel Environment Variables  

---

**Результат**:  
- Продакшен-версия на Vercel  
- Техдокументация по API  
- README с инструкциями по развертыванию