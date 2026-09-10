import React from 'react';
import './styles/premium-ui.css';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Protected from './components/Protected';
import { useAuth } from './context/AuthContext';
import { About, Cart } from './pages/Pages';
import { ProductDetailPage, EquipmentDetailPage } from './pages/DetailPages';
import FarmerDashboardMain from './pages/FarmerDashboardMain';
import RoleDashboard from './pages/FarmerDashboard';
import EquipmentRental from './pages/EquipmentRental';
import SimpleAuth from './pages/SimpleAuth';
import BuyerMarketplace from './pages/BuyerMarketplace';
import FarmerCommunity from './pages/FarmerCommunity';
import AdminDashboard from './pages/AdminDashboard';
import BuyerOrders from './pages/BuyerOrders';

function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === 'buyer') return <Navigate to="/products" replace />;
  return user?.role === 'farmer' ? <FarmerDashboardMain /> : user?.role === 'admin' ? <AdminDashboard /> : <RoleDashboard />;
}

export default function App() { return <BrowserRouter><Layout><Routes>
  <Route path="/" element={<Navigate to="/login" replace />} /><Route path="/about" element={<About />} />
  <Route path="/login" element={<SimpleAuth mode="login" />} /><Route path="/register" element={<SimpleAuth mode="register" />} />
  <Route path="/products" element={<BuyerMarketplace />} /><Route path="/products/:id" element={<ProductDetailPage />} />
  <Route path="/purchases" element={<Protected roles={['buyer']}><BuyerOrders /></Protected>} />
  <Route path="/equipment" element={<EquipmentRental />} /><Route path="/equipment/:id" element={<EquipmentDetailPage />} />
  <Route path="/community" element={<FarmerCommunity />} /><Route path="/cart" element={<Protected roles={['buyer']}><Cart /></Protected>} />
  <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
  <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} /><Route path="*" element={<Navigate to="/login" replace />} />
</Routes></Layout></BrowserRouter>; }
