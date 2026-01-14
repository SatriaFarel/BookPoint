
import React from 'react';
import { UserRole, UserStatus, OrderStatus, User, Category, Book, Order } from './types';

export const DUMMY_USERS: User[] = [
  { id: '1', name: 'Admin Utama', email: 'admin@lumina.com', role: UserRole.SUPER_ADMIN, status: UserStatus.ONLINE },
  { id: '2', name: 'Gramedia Official', email: 'gramedia@seller.com', role: UserRole.SELLER, status: UserStatus.ONLINE },
  { id: '3', name: 'Buku Kita', email: 'bukukita@seller.com', role: UserRole.SELLER, status: UserStatus.OFFLINE },
  { id: '4', name: 'John Doe', email: 'john@buyer.com', role: UserRole.BUYER },
  { id: '5', name: 'Jane Smith', email: 'jane@buyer.com', role: UserRole.BUYER },
];

export const DUMMY_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Fiksi' },
  { id: 'c2', name: 'Teknologi' },
  { id: 'c3', name: 'Bisnis' },
  { id: 'c4', name: 'Self-Improvement' },
];

export const DUMMY_BOOKS: Book[] = [
  { id: 'b1', name: 'Clean Code', price: 150000, stock: 12, category: 'Teknologi', image: 'https://picsum.photos/seed/code/400/600', sellerId: '2' },
  { id: 'b2', name: 'The Psychology of Money', price: 98000, stock: 5, category: 'Bisnis', image: 'https://picsum.photos/seed/money/400/600', sellerId: '2' },
  { id: 'b3', name: 'Atomic Habits', price: 125000, stock: 0, category: 'Self-Improvement', image: 'https://picsum.photos/seed/habits/400/600', sellerId: '3' },
  { id: 'b4', name: 'Harry Potter', price: 175000, stock: 20, category: 'Fiksi', image: 'https://picsum.photos/seed/hp/400/600', sellerId: '2' },
  { id: 'b5', name: 'Zero to One', price: 110000, stock: 8, category: 'Bisnis', image: 'https://picsum.photos/seed/zero/400/600', sellerId: '2' },
  { id: 'b6', name: 'The Alchemist', price: 85000, stock: 15, category: 'Fiksi', image: 'https://picsum.photos/seed/alchemist/400/600', sellerId: '3' },
];

export const DUMMY_ORDERS: Order[] = [
  { 
    id: 'ORD-001', 
    buyerName: 'John Doe', 
    items: [{ bookName: 'Clean Code', quantity: 1, price: 150000 }], 
    total: 150000, 
    status: OrderStatus.APPROVED, 
    date: '2023-10-25',
    resi: 'JNE123456789'
  },
  { 
    id: 'ORD-002', 
    buyerName: 'Jane Smith', 
    items: [{ bookName: 'The Psychology of Money', quantity: 2, price: 98000 }], 
    total: 196000, 
    status: OrderStatus.PENDING, 
    date: '2023-10-26',
    paymentProof: 'https://picsum.photos/seed/proof/400/600'
  },
  { 
    id: 'ORD-003', 
    buyerName: 'Rian Adit', 
    items: [{ bookName: 'Atomic Habits', quantity: 1, price: 125000 }], 
    total: 125000, 
    status: OrderStatus.REJECTED, 
    date: '2023-10-24'
  },
];

export const SALES_DATA = [
  { month: 'Jan', margin: 4000, profit: 2400 },
  { month: 'Feb', margin: 3000, profit: 1398 },
  { month: 'Mar', margin: 2000, profit: 9800 },
  { month: 'Apr', margin: 2780, profit: 3908 },
  { month: 'May', margin: 1890, profit: 4800 },
  { month: 'Jun', margin: 2390, profit: 3800 },
];
