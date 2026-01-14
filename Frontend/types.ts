
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SELLER = 'SELLER',
  BUYER = 'BUYER'
}

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
}

export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  sellerId?: string;
}

export interface Order {
  id: string;
  buyerName: string;
  items: { bookName: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  paymentProof?: string;
  date: string;
  resi?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
