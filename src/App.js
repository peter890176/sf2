import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <AuthProvider>
    <CartProvider>
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
              <Route path="/checkout" element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              } />
              <Route path="/order-success/:id" element={
                <PrivateRoute>
                  <OrderSuccessPage />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
