import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';

import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import CategoriesPage from './pages/admin/Categories';
import SellersPage from './pages/admin/Sellers';
import CustomersPage from './pages/admin/Customers';

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerReports from './pages/seller/SellerReports';
import SellerHelp from './pages/seller/SellerHelp';

import BuyerHome from './pages/buyer/BuyerHome';
import BuyerCart from './pages/buyer/BuyerCart';
import BuyerTransactions from './pages/buyer/BuyerTransactions';
import BuyerInvoice from './pages/buyer/BuyerInvoice';

import DashboardLayout from './components/DashboardLayout';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('lumina_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('lumina_user', JSON.stringify(u));
  };

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include', // penting kalau pakai session
      });
    } catch {
      // kalau gagal pun tetap logout frontend
    } finally {
      setUser(null);
      localStorage.removeItem('lumina_user');
      window.location.href = '#/login'; // paksa bersih
    }
  };


  return (
    <HashRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
        <Route path="/register" element={<Register />} />

        {/* SUPER ADMIN */}
        <Route
          path="/admin/*"
          element={
            user?.role === UserRole.SUPER_ADMIN
              ? <DashboardLayout user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="sellers" element={<SellersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>

        {/* SELLER */}
        <Route
          path="/seller/*"
          element={
            user?.role === UserRole.SELLER
              ? <DashboardLayout user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="reports" element={<SellerReports />} />
          <Route path="help" element={<SellerHelp />} />
        </Route>

        {/* BUYER — JANGAN NESTED */}
        <Route
          path="/buyer"
          element={
            user?.role === UserRole.CUSTOMER
              ? <BuyerHome user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/buyer/cart"
          element={
            user?.role === UserRole.CUSTOMER
              ? <BuyerCart user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/buyer/transactions"
          element={
            user?.role === UserRole.CUSTOMER
              ? <BuyerTransactions user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/buyer/invoice/:id"
          element={
            user?.role === UserRole.CUSTOMER
              ? <BuyerInvoice user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            user
              ? user.role === UserRole.SUPER_ADMIN
                ? <Navigate to="/admin" />
                : user.role === UserRole.SELLER
                  ? <Navigate to="/seller" />
                  : <Navigate to="/buyer" />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
