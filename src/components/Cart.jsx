import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
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
        {cartItems.map((item) => {
          const hasDiscount = Math.round(item.discountPercentage) > 0;
          const discountedPrice = item.price * (1 - item.discountPercentage / 100);

          return (
            <div key={item.id} className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <div>
                      {hasDiscount ? (
                        <>
                          <span className="text-black font-bold">${discountedPrice.toFixed(2)}</span>
                          <span className="line-through ml-2">${item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-black font-bold">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="ml-2 flex-shrink-0">x {item.quantity}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                  <p className="font-semibold w-24 text-right break-all">${(discountedPrice * item.quantity).toFixed(2)}</p>
                  <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Remove item"
                  >
                      X
                  </button>
              </div>
            </div>
          );
        })}
      </div>
      <hr className="my-4" />
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span>${getCartTotal().toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Cart; 