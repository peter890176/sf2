import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <div className="bg-gray-100 min-h-screen">
            <NavBar />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                } />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:id" element={
                  <PrivateRoute>
                    <OrderSuccessPage />
                  </PrivateRoute>
                } />
                <Route path="/orders" element={<Navigate to="/profile" state={{ view: 'orders' }} />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
