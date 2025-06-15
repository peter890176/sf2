import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/orders');
                const ordersList = response.data?.data?.orders || [];
                const sortedOrders = ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p className="text-center">Loading orders...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>
            {orders.length === 0 ? (
                <p className="text-gray-600">You have no orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-4 flex-wrap">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Order #{order._id}</h3>
                                    <p className="text-sm text-gray-500">
                                        Date: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${
                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="space-y-4 mb-4">
                                    {(order.items || []).map(item => (
                                        <div key={item.product || item._id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                                                <div>
                                                    <p className="text-gray-700 font-semibold">{item.name || `Product ID: ${item.product}`}</p>
                                                    <p className="text-gray-500">Qty: {item.quantity || 0}</p>
                                                </div>
                                            </div>
                                            <span className="text-gray-800 font-medium">${((item.finalPrice || 0) * (item.quantity || 0)).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end items-center border-t border-gray-200 pt-4 mt-4">
                                    <span className="text-gray-600 font-semibold text-lg">
                                        Total: ${(order.totalAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory; 