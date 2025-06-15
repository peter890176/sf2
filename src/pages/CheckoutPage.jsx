import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItemRow from '../components/CartItemRow';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data.data.addresses;
        setAddresses(list);
        // Set default address selection
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load addresses.');
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="mb-4">You need to log in before placing an order.</p>
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const buildPayload = () => ({
    orderItems: cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    })),
    shippingAddress: {
      addressLine: selectedAddress.addressLine,
      city: selectedAddress.city,
      postalCode: selectedAddress.postalCode,
      state: selectedAddress.state,
    },
  });

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select an address.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Cart is empty.');
      return;
    }
    try {
      setPlacingOrder(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, buildPayload(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderId = res.data.data.order._id;
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place the order. Please try again later.';
      alert(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Address selection */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        {loadingAddresses ? (
          <p>Loading...</p>
        ) : addresses.length === 0 ? (
          <div>
            <p className="text-gray-600 mb-2">You haven't added any address yet.</p>
            <Link to="/profile" className="text-blue-600 underline">
              Go to profile to add address
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className="flex items-start gap-3 p-4 border rounded-md cursor-pointer hover:border-gray-400"
              >
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddressId === addr._id}
                  onChange={() => setSelectedAddressId(addr._id)}
                  className="mt-1 h-4 w-4 text-indigo-600"
                />
                <span>
                  <span className="font-semibold">{addr.addressLine}</span>
                  <br />
                  {addr.city}, {addr.state} {addr.postalCode}
                  {addr.isDefault && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">Default</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </section>

      {/* Order details */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </section>

      {/* Place order button */}
      <div className="text-right">
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder || cartItems.length === 0 || !selectedAddress}
          className={`px-6 py-3 text-white rounded-lg transition-colors ${
            placingOrder || cartItems.length === 0 || !selectedAddress
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {placingOrder ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage; 