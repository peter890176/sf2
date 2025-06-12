import React, { useState, useEffect, memo, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './StarRating.css'; // Import the styles directly

const ProductCard = memo(({ 
  product, 
  index, 
  addCartNotification,
  onAddToCart,
  onStockLimit,
  clearNotification,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    
    if (newQuantity > product.stock) {
      onStockLimit(product);
      return;
    }

    // 當使用者調整為有效數量時，清除可能存在的舊通知
    clearNotification(product.id);
    setQuantity(newQuantity);
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const totalPrice = discountedPrice * quantity;
  const originalTotalPrice = product.price * quantity;

  return (
    <div className="@container bg-white border rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="w-full h-48 object-contain" 
            loading={index < 12 ? 'eager' : 'lazy'} 
          />
        </Link>
      </div>
      <div className="px-4 pt-4 pb-3 flex flex-col flex-grow">
        <div className="flex justify-end items-center">
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
        <div className="flex-grow">
          <Link to={`/product/${product.id}`} className="hover:underline">
            <h2 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h2>
          </Link>
          <div className="flex justify-between items-baseline mt-1">
            <div className="text-sm text-gray-600 flex flex-wrap">
              {quantity > 1 && (
                <span>${discountedPrice.toFixed(2)} x {quantity}</span>
              )}
            </div>
            <div className="flex items-baseline space-x-2 flex-wrap justify-end">
              {Math.round(product.discountPercentage) > 0 ? (
                <>
                  <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    -{product.discountPercentage.toFixed(0)}%
                  </div>
                  <p className="text-lg font-bold">
                    ${totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    ${originalTotalPrice.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold">
                  ${totalPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-col @[15rem]:flex-row items-center space-y-2 @[15rem]:space-y-0 @[15rem]:space-x-4">
            <div className="flex items-center rounded border border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                className="h-8 w-7 text-xl text-gray-600 transition hover:opacity-75 flex items-center justify-center"
              >
                -
              </button>
              <div className="h-8 w-8 border-x border-gray-200 text-center flex items-center justify-center text-sm">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="h-8 w-7 text-xl text-gray-600 transition hover:opacity-75 flex items-center justify-center"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product, quantity)}
              className="flex-grow @[15rem]:w-auto text-white h-8 px-4 rounded transition-colors bg-black hover:bg-gray-800 whitespace-nowrap"
            >
              Add to Cart
            </button>
          </div>
          <div className="text-xs h-4 mt-1 text-center">
            {addCartNotification && (
              <p className={addCartNotification.includes('Added') ? 'text-black' : 'text-red-500'}>
                {addCartNotification}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartItems } = useCart();
  const [addCartNotifications, setAddCartNotifications] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const showStockNotification = useCallback((product) => {
    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    let message = `Only ${product.stock} left in stock!`;
    if (quantityInCart > 0) {
      message += ` (${quantityInCart} in cart)`;
    }
    setAddCartNotifications(prev => ({ ...prev, [product.id]: message }));
    setTimeout(() => {
      setAddCartNotifications(prev => ({ ...prev, [product.id]: undefined }));
    }, 3000);
  }, [cartItems]);

  const clearNotification = useCallback((productId) => {
    setAddCartNotifications(prev => {
      if (!prev[productId] || prev[productId].includes('Added to cart!')) return prev;
      const newNotifs = {...prev};
      delete newNotifs[productId];
      return newNotifs;
    });
  }, []);

  const handleAddToCart = useCallback((product, quantityToAdd) => {
    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (quantityInCart + quantityToAdd > product.stock) {
      showStockNotification(product);
      return;
    }

    addToCart(product, quantityToAdd);
    setAddCartNotifications(prev => ({ ...prev, [product.id]: 'Added to cart!' }));
    setTimeout(() => {
      setAddCartNotifications(prev => ({ ...prev, [product.id]: undefined }));
    }, 2000);
  }, [cartItems, addToCart, showStockNotification]);

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
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div>
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.replace(/-/g, ' ')}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => {
          const addCartNotification = addCartNotifications[product.id];

          return (
            <ProductCard 
              key={product.id}
              product={product}
              index={index}
              addCartNotification={addCartNotification}
              onAddToCart={handleAddToCart}
              onStockLimit={showStockNotification}
              clearNotification={clearNotification}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductList; 