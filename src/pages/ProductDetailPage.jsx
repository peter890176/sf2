import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';
import StarRating from '../components/StarRating';
import api from '../api/axios';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addCartNotification, setAddCartNotification] = useState('');

  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [magnifiedWidth, setMagnifiedWidth] = useState(0);
  
  const magnifiedContainerRef = useRef(null);
  const imageRef = useRef(null);

  const zoomFactor = 1.8;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${id}`);
        const prod = response.data.data?.product || response.data.product || response.data;
        const normalized = { ...prod, id: prod._id };
        setProduct(normalized);
        setCurrentImageIndex(0);
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
    setImgWidth(width);
    setImgHeight(height);
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

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > product.stock) {
      const itemInCart = cartItems.find(item => item.id === product.id);
      const quantityInCart = itemInCart ? itemInCart.quantity : 0;
      let message = `Only ${product.stock} left in stock!`;
      if (quantityInCart > 0) {
        message += ` (${quantityInCart} in cart)`;
      }
      setAddCartNotification(message);
      setTimeout(() => setAddCartNotification(''), 3000);
      return; 
    }

    if (newQuantity > 0) {
      setQuantity(newQuantity);
      if (addCartNotification) {
        setAddCartNotification('');
      }
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const itemInCart = cartItems.find(item => item.id === product.id);
      const quantityInCart = itemInCart ? itemInCart.quantity : 0;

      if (quantityInCart + quantity > product.stock) {
        let message = `Only ${product.stock} left in stock!`;
        if (quantityInCart > 0) {
            message += ` (${quantityInCart} in cart)`;
        }
        setAddCartNotification(message);
        setTimeout(() => setAddCartNotification(''), 3000);
        return;
      }

      addToCart(product, quantity);
      setAddCartNotification('Successfully added to cart!');
      setTimeout(() => {
        setAddCartNotification('');
      }, 3000);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Product not found</p>;
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const totalPrice = discountedPrice * quantity;
  const originalTotalPrice = product.price * quantity;

  const selectedImage = product?.images[currentImageIndex];
  const hasMultipleImages = product && product.images && product.images.length > 1;

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline">&larr; Back to Product List</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col items-center">
          <div className="bg-white border rounded-lg shadow-md md:flex relative h-full">
            {/* Image Container */}
            <div className="md:w-1/2 relative p-4 flex flex-col">
              <div className="relative mb-4">
                <img
                  ref={imageRef}
                  className="w-full h-auto object-contain cursor-crosshair"
                  src={selectedImage}
                  alt={product.title}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
                    >
                      &#10094;
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
                    >
                      &#10095;
                    </button>
                  </>
                )}

                <div
                  className="magnifier-lens"
                  style={{
                    display: showMagnifier ? 'block' : 'none',
                    top: `${lensTop}px`,
                    left: `${lensLeft}px`,
                    width: `${lensWidth}px`,
                    height: `${lensHeight}px`,
                    pointerEvents: 'none',
                  }}
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                {product?.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover cursor-pointer border-2 ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
            
            {/* Details Container */}
            <div className="md:w-1/2 flex flex-col justify-between p-6">
              <div className="flex-grow">
                {product?.brand && (
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-3xl font-bold text-gray-800">{product?.title}</h1>
                <div className="flex items-center my-2">
                  <StarRating rating={product.rating || 0} size={24} />
                  <span className="ml-2 text-gray-600">({product.rating.toFixed(2)})</span>
                </div>
                <p className="text-gray-600 mt-4">{product?.description}</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-end mb-4">
                  {/* Left side: Calculation */}
                  <div className="text-lg text-gray-600">
                    {quantity > 1 && (
                      <span>${discountedPrice.toFixed(2)} x {quantity}</span>
                    )}
                  </div>

                  {/* Right side: Price */}
                  <div className="flex flex-col items-end">
                    {Math.round(product.discountPercentage) > 0 ? (
                      <>
                        <div className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full mb-1">
                          -{product.discountPercentage.toFixed(0)}%
                        </div>
                        <p className="text-lg text-gray-500 line-through">
                          ${originalTotalPrice.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          ${totalPrice.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">
                        ${totalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
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
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="h-6 mt-2 text-center">
                    {addCartNotification && (
                      <p className={addCartNotification.includes('Successfully') ? 'text-black' : 'text-red-500'}>
                        {addCartNotification}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Magnifier Container - Sibling to Image and Details */}
            <div
                ref={magnifiedContainerRef}
                style={{
                    visibility: showMagnifier ? 'visible' : 'hidden',
                    position: 'absolute',
                    left: '50%',
                    top: '0',
                    width: '50%',
                    height: '100%',
                    backgroundColor: '#fff',
                    backgroundImage: `url(${JSON.stringify(selectedImage)})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${imgWidth * zoomFactor}px ${imgHeight * zoomFactor}px`,
                    backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
                    zIndex: 10,
                    borderLeft: '1px solid #e5e7eb',
                    pointerEvents: 'none',
                }}
            />
          </div>
        </div>
        
        {/* Right Part: Cart */}
        <div className="md:col-span-1">
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 