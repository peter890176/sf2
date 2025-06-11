import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">購物車</h2>
        <p className="text-gray-500">您的購物車是空的。</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">購物車</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-4">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="移除商品"
                >
                    X
                </button>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between items-center font-bold text-lg">
        <span>總計</span>
        <span>${getCartTotal().toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Cart; 