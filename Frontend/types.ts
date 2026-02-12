
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER'
}

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum OrderStatus {
  PENDING = 'diperiksa',
  APPROVED = 'disetujui',
  REJECTED = 'ditolak',
  SHIPPED = 'dikirim',
  DONE = 'selesai',
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
}

export interface Seller {
  id: number;
  nik: string;
  name: string;
  email: string;
  alamat: string;
  password?: string; 
  no_rekening?: string;
  foto?: string;
  qris?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_online: boolean;
}

export interface Customer {
  id: number;
  nik: string;
  name: string;
  email: string;
  alamat: string;
  foto: string;
  password?: string; // jangan ditampilin asli
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  category_name: string;
  image: string | null;
  name: string;
  stock: number;
  price: number;
  discount_percent: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
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

export interface BuyerCartProps {
  user: User;
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  selected: boolean;
};

export type CheckoutItem = {
  id: number;
  seller_id: number;
  name: string;
  price: number;
  qty: number;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
