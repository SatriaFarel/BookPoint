
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerCategories from './pages/seller/SellerCategories';
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
        
        {/* Protected Routes based on Role */}
        {user?.role === UserRole.SUPER_ADMIN && (
          <Route path="/admin/*" element={<DashboardLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        )}

        {user?.role === UserRole.SELLER && (
          <Route path="/seller/*" element={<DashboardLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<SellerDashboard />} />
            <Route path="categories" element={<SellerCategories />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="reports" element={<SellerReports />} />
            <Route path="help" element={<SellerHelp />} />
            <Route path="*" element={<Navigate to="/seller" replace />} />
          </Route>
        )}

        {user?.role === UserRole.BUYER && (
          <Route path="/buyer/*">
            <Route index element={<BuyerHome user={user} onLogout={handleLogout} />} />
            <Route path="cart" element={<BuyerCart user={user} onLogout={handleLogout} />} />
            <Route path="transactions" element={<BuyerTransactions user={user} onLogout={handleLogout} />} />
            <Route path="invoice/:id" element={<BuyerInvoice user={user} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/buyer" replace />} />
          </Route>
        )}

        {/* Catch-all redirect */}
        <Route path="*" element={
          user ? (
            user.role === UserRole.SUPER_ADMIN ? <Navigate to="/admin" /> :
            user.role === UserRole.SELLER ? <Navigate to="/seller" /> :
            <Navigate to="/buyer" />
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
