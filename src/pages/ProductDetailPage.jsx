import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0]);
  const [magnifiedWidth, setMagnifiedWidth] = useState(0);
  
  const magnifiedContainerRef = useRef(null);
  const imageRef = useRef(null);

  const zoomFactor = 1.8;

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

  useEffect(() => {
    if (magnifiedContainerRef.current) {
        const { width } = magnifiedContainerRef.current.getBoundingClientRect();
        setMagnifiedWidth(width);
    }
  }, [showMagnifier]);


  const handleMouseEnter = (e) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setImgSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    setXY([x, y]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

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

  const lensWidth = magnifiedWidth / zoomFactor;
  const lensHeight = imgHeight / zoomFactor;

  // Clamp the center coordinates of the lens to keep it within the image bounds
  const cx = Math.max(lensWidth / 2, Math.min(x, imgWidth - lensWidth / 2));
  const cy = Math.max(lensHeight / 2, Math.min(y, imgHeight - lensHeight / 2));

  // The lens's top-left position is based on the clamped center
  const lensTop = cy - lensHeight / 2;
  const lensLeft = cx - lensWidth / 2;

  // The background position is also based on the clamped center
  const backgroundPositionX = -(cx * zoomFactor - magnifiedWidth / 2);
  const backgroundPositionY = -(cy * zoomFactor - imgHeight / 2);

  return (
    <div className="container mx-auto p-4">
       <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">&larr; 返回商品列表</Link>
      </div>
      <div className="bg-white border rounded-lg shadow-md md:flex relative">
        <div className="md:w-1/2 relative">
          {product && (
            <img
              ref={imageRef}
              className="w-full h-auto object-cover cursor-crosshair"
              src={product.images[0]}
              alt={product.title}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          )}

          <div
            className="magnifier-lens"
            style={{
              display: showMagnifier ? 'block' : 'none',
              top: `${lensTop}px`,
              left: `${lensLeft}px`,
              width: `${lensWidth}px`,
              height: `${lensHeight}px`,
            }}
          />
        </div>
        
        <div className="md:w-1/2 flex flex-col justify-between p-6">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-800">{product?.title}</h1>
            <p className="text-xl text-gray-700 mt-2">${product?.price.toFixed(2)}</p>
            <p className="text-gray-600 mt-4">{product?.description}</p>
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

        <div
            ref={magnifiedContainerRef}
            style={{
                visibility: showMagnifier ? 'visible' : 'hidden',
                position: 'absolute',
                left: '50%',
                top: '0',
                width: '50%',
                height: imgHeight > 0 ? `${imgHeight}px` : 'auto',
                backgroundColor: '#fff',
                backgroundImage: `url(${JSON.stringify(product?.images[0])})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${imgWidth * zoomFactor}px ${imgHeight * zoomFactor}px`,
                backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
                zIndex: 10,
                borderLeft: '1px solid #e5e7eb'
            }}
        />
        
      </div>
    </div>
  );
};

export default ProductDetailPage; 