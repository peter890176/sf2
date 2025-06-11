import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './StarRating.css'; // Import the styles directly

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartItems } = useCart();
  const [quantities, setQuantities] = useState({});
  const [addCartNotifications, setAddCartNotifications] = useState({});

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.stock) {
      const itemInCart = cartItems.find(item => item.id === productId);
      const quantityInCart = itemInCart ? itemInCart.quantity : 0;
      let message = `庫存僅剩 ${product.stock} 件！`;
      if (quantityInCart > 0) {
        message += ` (購物車已有 ${quantityInCart} 件)`;
      }
      setAddCartNotifications(prev => ({ ...prev, [productId]: message }));
      setTimeout(() => {
        setAddCartNotifications(prev => ({ ...prev, [productId]: '' }));
      }, 3000);
      return;
    }
    
    if (newQuantity > 0) {
        setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
        if (addCartNotifications[productId]) {
            setAddCartNotifications(prev => ({ ...prev, [productId]: '' }));
        }
    }
  };

  const handleAddToCart = (product) => {
    const quantityToAdd = quantities[product.id] || 1;
    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (quantityInCart + quantityToAdd > product.stock) {
      let message = `庫存僅剩 ${product.stock} 件！`;
      if (quantityInCart > 0) {
        message += ` (購物車已有 ${quantityInCart} 件)`;
      }
      setAddCartNotifications(prev => ({ ...prev, [product.id]: message }));
      setTimeout(() => {
        setAddCartNotifications(prev => ({ ...prev, [product.id]: '' }));
      }, 3000);
      return;
    }

    addToCart(product, quantityToAdd);
    setAddCartNotifications(prev => ({ ...prev, [product.id]: '成功加入購物車！' }));
    setTimeout(() => {
      setAddCartNotifications(prev => ({ ...prev, [product.id]: '' }));
    }, 2000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">載入中...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">錯誤: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const quantity = quantities[product.id] || 1;
        const discountedPrice = product.price * (1 - product.discountPercentage / 100);
        const totalPrice = discountedPrice * quantity;
        const originalTotalPrice = product.price * quantity;

        return (
          <div key={product.id} className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="relative">
              <Link to={`/product/${product.id}`}>
                <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-contain" />
              </Link>
              <div className="absolute bottom-2 right-2 flex items-center">
                <div className="star-rating-wrapper" style={{ fontSize: '16px' }}>
                  <div className="stars-background">
                    <span>★</span>
                  </div>
                  <div className="stars-foreground" style={{ width: `${(product.rating / 5) * 100}%` }}>
                    <span>★</span>
                  </div>
                </div>
                <span className="ml-1 text-sm font-bold text-black">{product.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <Link to={`/product/${product.id}`} className="hover:underline">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h2>
              </Link>

              <div className="flex justify-between items-baseline mt-1">
                {/* Left side: Calculation */}
                <div className="text-sm text-gray-600">
                  {quantity > 1 && (
                    <span>${discountedPrice.toFixed(2)} x {quantity}</span>
                  )}
                </div>

                {/* Right side: Price */}
                {Math.round(product.discountPercentage) > 0 ? (
                  <div className="flex items-baseline space-x-2">
                    <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      -{product.discountPercentage.toFixed(0)}%
                    </div>
                    <p className="text-lg font-bold">
                      ${totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      ${originalTotalPrice.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-lg font-bold">
                    ${totalPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="mt-auto pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center rounded border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                      className="h-8 w-8 text-xl text-gray-600 transition hover:opacity-75 flex items-center justify-center"
                    >
                      -
                    </button>
                    <div className="h-8 w-10 border-x border-gray-200 text-center flex items-center justify-center text-sm">
                      {quantities[product.id] || 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                      className="h-8 w-8 text-xl text-gray-600 transition hover:opacity-75 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-grow text-white h-8 px-4 rounded transition-colors bg-black hover:bg-gray-800"
                  >
                    加入購物車
                  </button>
                </div>
                <div className="text-xs h-4 mt-1 text-center">
                  {addCartNotifications[product.id] && (
                    <p className={addCartNotifications[product.id].includes('成功') ? 'text-black' : 'text-red-500'}>
                      {addCartNotifications[product.id]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList; 