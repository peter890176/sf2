import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1500);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">載入中...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">錯誤: {error}</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">找不到商品</p>;
  }

  return (
    <div className="container mx-auto p-4">
       <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">&larr; 返回商品列表</Link>
      </div>
      <div className="bg-white border rounded-lg shadow-md overflow-hidden md:flex">
        <div className="md:w-1/2">
            <img src={product.thumbnail} alt={product.title} className="w-full h-auto object-cover"/>
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-xl text-gray-700 mt-2">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center rounded border border-gray-200">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="h-10 w-10 text-xl text-gray-600 transition hover:opacity-75 flex items-center justify-center"
                >
                  -
                </button>
                <div className="h-10 w-12 border-x border-gray-200 text-center flex items-center justify-center text-sm">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="h-10 w-10 text-xl text-gray-600 transition hover:opacity-75 flex items-center justify-center"
                >
                  +
                </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-grow text-white h-10 px-6 rounded transition-colors ${
                added
                  ? 'bg-green-500'
                  : 'bg-black hover:bg-gray-800'
              }`}
              disabled={added}
            >
              {added ? '已加入!' : '加入購物車'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 