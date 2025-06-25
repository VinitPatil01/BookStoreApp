import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from './CartContext';
import { getUserEmail } from '../utils/auth';
import axios from 'axios';
import { getToken } from '../services/userService';
import {useNavigate} from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    totalAmount, 
    cartCount, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    fetchCart,
    loading: cartLoading 
  } = useCart();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review, 4: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userEmail = getUserEmail();
  const token = getToken();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState('PENDING');

  

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced && !cartLoading) {
      navigate('/cart');
    }
    loadAddresses();
  }, [cart, navigate, orderPlaced, cartLoading]);

  const loadAddresses = async () => {
    
    const mockAddresses = [
      {
        id: 1,
        fullName: 'Buyer',
        phoneNumber: '9876543210',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true
      }
    ];
    setAddresses(mockAddresses);
    if (mockAddresses.length > 0) {
      setSelectedAddressId(mockAddresses.find(addr => addr.isDefault)?.id || mockAddresses[0].id);
    }
  };

  const handleAddressSubmit = () => {
    if (!newAddress.fullName || !newAddress.phoneNumber || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setError('Please fill all required fields');
      return;
    }
    
    const addressToAdd = {
      ...newAddress,
      id: Date.now() 
    };
    setAddresses([...addresses, addressToAdd]);
    setSelectedAddressId(addressToAdd.id);
    setShowAddressForm(false);
    setNewAddress({
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setError('');
  };

  const formatShippingAddress = (address) => {
    return `${address.fullName}, ${address.phoneNumber}, ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    
    try {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      
      // Create order request matching updated DTO structure
      const orderRequest = {
        totalAmount: totalAmount,
        shippingAddress: formatShippingAddress(selectedAddress),
        status: "PENDING",
        items: cart.map(item => ({
          bookId: item.book.bookId,
          quantity: item.quantity,
          priceAtPurchase: item.book.price
        }))
      };

      console.log(orderRequest);

      // API call to create order
      const response = await axios.post(`http://localhost:9090/api/orders/user/${userEmail}`,orderRequest,{
        headers:{Authorization:`Bearer ${token}`}
    })

      if (response.data.message!="Order created successfully") {
        const errorData = await response.data;
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      
      if (data.success !== false) {
        const newOrderId = data.orderId || data.data?.orderId || data.id || `ORD${Date.now()}`;
        setOrderId(newOrderId);
        setOrderStatus('PENDING');
        setOrderPlaced(true);
        setStep(4);
        clearCart();
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while placing the order');
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderAddressStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
        <button
          onClick={() => setShowAddressForm(true)}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          + Add New Address
        </button>
      </div>

      {showAddressForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newAddress.phoneNumber}
              onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={newAddress.addressLine1}
              onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
              className="col-span-2 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={newAddress.addressLine2}
              onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
              className="col-span-2 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
            <div className="col-span-2 flex space-x-4">
              <button
                type="button"
                onClick={handleAddressSubmit}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddressId === address.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedAddressId(address.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{address.fullName}</h3>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{address.phoneNumber}</p>
                  <p className="text-gray-600">
                    {address.addressLine1}{address.addressLine2 ? ', ' + address.addressLine2 : ''}
                  </p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!selectedAddressId}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        Continue to Payment
      </button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>

      <div className="space-y-4">
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'card' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            <CreditCard size={20} />
            <span className="font-medium">Credit/Debit Card</span>
          </div>
        </div>

        <div
          className={`border-2 rounded-lg p-4 cursor-pointer ${
            paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}
          onClick={() => setPaymentMethod('cod')}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
            />
            <Truck size={20} />
            <span className="font-medium">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Card Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
              className="col-span-2 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardDetails.cardholderName}
              onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
              className="col-span-2 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
              className="col-span-1 p-3 border rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
        >
          Back to Address
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
        >
          Review Order
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>

        {/* Order Items */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.book.bookId} className="flex items-center space-x-4">
                <img
                  src={item.book.coverImageUrl || '/placeholder.png'}
                  alt={item.book.title}
                  className="w-16 h-20 object-contain"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.book.title}</h4>
                  <p className="text-gray-600">by {item.book.author}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Price at Purchase: ₹{item.book.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold">₹{(item.book.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
          {selectedAddress && (
            <div>
              <p className="font-medium">{selectedAddress.fullName}</p>
              <p className="text-gray-600">{selectedAddress.phoneNumber}</p>
              <p className="text-gray-600">
                {selectedAddress.addressLine1}{selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}
              </p>
              <p className="text-gray-600">
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <p className="text-gray-600">
            {paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({cartCount} items)</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={() => setStep(2)}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
          >
            Back to Payment
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : `Place Order - ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    );
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
      </div>
      {orderId && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-3">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-semibold">{orderId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(orderStatus)}`}>
              {orderStatus}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-semibold">₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      )}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => navigate('/')}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/orders')}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
        >
          View My Orders
        </button>
      </div>
    </div>
  );

  // Show loading if cart is being fetched
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center space-x-8 mb-8">
            {[
              { num: 1, label: 'Address', icon: MapPin },
              { num: 2, label: 'Payment', icon: CreditCard },
              { num: 3, label: 'Review', icon: CheckCircle }
            ].map(({ num, label, icon: Icon }) => (
              <div key={num} className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > num ? <CheckCircle size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-sm ${step >= num ? 'text-purple-600' : 'text-gray-600'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {step === 1 && renderAddressStep()}
          {step === 2 && renderPaymentStep()}
          {step === 3 && renderReviewStep()}
          {step === 4 && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
};

export default Checkout;