import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import CategoriesPage from './pages/admin/Categories';
import SellersPage from './pages/admin/Sellers';
import CustomersPage from './pages/admin/Customers';
import HelpPage from './pages/admin/Help';

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerReports from './pages/seller/SellerReports';
import SellerHelp from './pages/seller/SellerHelp';

import BuyerHome from './pages/buyer/BuyerHome';
import BuyerCart from './pages/buyer/BuyerCart';
import BuyerTransactions from './pages/buyer/BuyerTransactions';
import BuyerCheckout from './pages/buyer/BuyerCheckout';
import BuyerInvoice from './pages/buyer/BuyerInvoice';

import DashboardLayout from './components/DashboardLayout';
import Profile from './components/Profile';
import ChatPage from './src/component/ChatPage';

import { User, UserRole } from './types';
import { echo } from './src/lib/echo'; // ⬅️ PENTING, harus import


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function App() {
  useEffect(() => {
    echo.channel('test-channel')
        .listen('TestEvent', (e) => {
          console.log('🔥 Event received:', e);
        });
  }, []);

  return <div>Realtime test</div>;
}

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = async () => {
    const raw = localStorage.getItem('user');
    const u = raw ? JSON.parse(raw) : null;

    if (!u?.id) {
      alert('Data user tidak valid');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ id: u.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || 'Logout gagal');
        return;
      }

      setUser(null);
      localStorage.removeItem('user');
      window.location.replace('#/login');

    } catch {
      alert('Server tidak bisa dihubungi');
    }
  };

  return (
    <HashRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ADMIN */}
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
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="help" element={<HelpPage />} />
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
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="chat/:chatId?" element={<ChatPage />} />
        </Route>

        {/* BUYER */}
        <Route
          path="/buyer"
          element={
            user?.role === UserRole.CUSTOMER
              ? <BuyerHome user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/buyer/cart" element={<BuyerCart user={user} onLogout={handleLogout} />} />
        <Route path="/buyer/transactions" element={<BuyerTransactions user={user} onLogout={handleLogout} />} />
        <Route path="/buyer/checkout" element={<BuyerCheckout user={user} onLogout={handleLogout} />} />
        <Route path="/buyer/invoice/:id" element={<BuyerInvoice user={user} onLogout={handleLogout} />} />
        <Route path="/buyer/profile" element={<Profile user={user} />} />
        <Route path="/buyer/chat/:sellerId" element={<ChatPage />} />


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
