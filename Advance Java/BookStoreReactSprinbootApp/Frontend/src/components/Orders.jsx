import React, { useEffect, useState } from 'react';
import { ChevronDown, Package, Calendar, MapPin, CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/userService';
import axios from 'axios';
import { getUserEmail } from '../utils/auth';

const Orders = () => {
  const navigate = useNavigate();
  const token = getToken();
  const userEmail = getUserEmail();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Calendar className="w-4 h-4" />;
      case 'CONFIRMED':
        return <Package className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <Package className="w-4 h-4" />;
      case 'CANCELLED':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    if (!userEmail || !token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9090/api/orders/user/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        console.error('Failed to fetch orders:', response.data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId, userEmail) => {
    try {
      const response = await axios.put(
        `http://localhost:9090/api/orders/${orderId}/user/${userEmail}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Refresh orders after cancellation
        fetchOrders();
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  };

  // View order details
  const handleViewDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:9090/api/orders/${orderId}/user/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setSelectedOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userEmail, token]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your <span className="text-purple-600">Orders</span>
              </h1>
              <p className="text-gray-600 max-w-md">
                Track and manage your book orders. From classics to modern reads, all your purchases in one place.
              </p>
              
              {/* Order stats */}
              <div className="mt-3 flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* No orders message */}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet. Start browsing our amazing collection of books!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span>Total: ₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(order.orderId)}
                        className="px-4 py-2 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId, order.userId)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {order.items && order.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0">
                            <img
                              src={item.book?.coverImageUrl || "/placeholder.png"}
                              alt={item.book?.title}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.book?.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ₹{item.book.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.shippingAddress.street}, {order.shippingAddress.city}, 
                            {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Details #{selectedOrder.orderId}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Order Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Order Date:</span>
                        <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Amount:</span>
                        <p className="font-medium">₹{selectedOrder.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {selectedOrder.items && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                            <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0">
                              <img
                                src={item.book?.coverImageUrl || "/placeholder.png"}
                                alt={item.book?.title}
                                className="w-full h-full object-contain rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.book?.title}</h4>
                              <p className="text-sm text-gray-600">by {item.book?.author}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {selectedOrder.shippingAddress && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {selectedOrder.shippingAddress.street}
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                        </p>
                        <p className="text-sm text-gray-900">
                          {selectedOrder.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;