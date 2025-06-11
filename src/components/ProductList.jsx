import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1000); // Display message for 1 second
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

        return (
          <div key={product.id} className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col">
            <Link to={`/product/${product.id}`}>
              <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-contain" />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
              <Link to={`/product/${product.id}`} className="hover:underline">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h2>
              </Link>

              <div className="mt-1">
                <div className="flex justify-end items-baseline space-x-2">
                  {Math.round(product.discountPercentage) > 0 && (
                    <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      -{product.discountPercentage.toFixed(0)}%
                    </div>
                  )}
                  <p className="text-lg font-bold">
                    ${discountedPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                {quantity > 1 && (
                   <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-600">
                        ${discountedPrice.toFixed(2)} x {quantity}
                      </p>
                      <p className="font-semibold text-gray-800">
                        ${totalPrice.toFixed(2)}
                      </p>
                   </div>
                )}
              </div>

              <div className="mt-auto pt-4 flex items-center space-x-4">
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
                  className={`flex-grow text-white h-8 px-4 rounded transition-colors ${
                    addedId === product.id
                      ? 'bg-green-500'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                  disabled={addedId === product.id}
                >
                  {addedId === product.id ? '已加入!' : '加入購物車'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList; 