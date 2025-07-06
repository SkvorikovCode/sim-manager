export interface User {
  id: string;
  phone: string;
  balance: number;
  tariff: Tariff;
  nextPaymentDate: string;
  isActive: boolean;
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}