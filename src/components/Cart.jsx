import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItemRow from './CartItemRow';

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const confirmTimeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      clearTimeout(confirmTimeoutRef.current);
    };
  }, []);

  const handleClearCart = () => {
    if (isConfirmingClear) {
      clearTimeout(confirmTimeoutRef.current);
      clearCart();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      confirmTimeoutRef.current = setTimeout(() => {
        setIsConfirmingClear(false);
      }, 3000); // 3 seconds to confirm
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        <button 
          onClick={handleClearCart}
          className={`text-sm font-semibold transition-all duration-200 ${
            isConfirmingClear 
              ? 'bg-red-600 text-white rounded px-3 py-1' 
              : 'text-red-500 hover:text-red-700'
          }`}
        >
          {isConfirmingClear ? 'Confirm Clear?' : 'Clear'}
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <CartItemRow key={item.id} item={item} onRemove={() => removeFromCart(item.id)} />
        ))}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      <button
        onClick={() => navigate('/checkout')}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart; 