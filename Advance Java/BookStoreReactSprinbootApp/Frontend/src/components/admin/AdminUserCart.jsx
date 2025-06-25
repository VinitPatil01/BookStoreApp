import React, { useState } from 'react';
import { getUserCartAdmin, clearUserCartAdmin } from '../../services/cartService';

const AdminUserCart = () => {
  const [userId, setUserId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');

  const handleFetchCart = async () => {
    try {
      const data = await getUserCartAdmin(userId);
      setCartItems(data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch cart.');
      setCartItems([]);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearUserCartAdmin(userId);
      setMessage('Cart cleared successfully.');
      setCartItems([]);
    } catch (error) {
      setMessage('Failed to clear cart.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin: View User Cart</h2>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleFetchCart} className="bg-blue-600 text-white p-2 rounded mr-2">
          Get Cart
        </button>
        <button onClick={handleClearCart} className="bg-red-600 text-white p-2 rounded">
          Clear Cart
        </button>
      </div>

      {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

      {cartItems.length > 0 && (
        <table className="w-full table-auto border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Book ID</th>
              <th className="border px-4 py-2">Book Title</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.bookId}>
                <td className="border px-4 py-2">{item.bookId}</td>
                <td className="border px-4 py-2">{item.bookTitle}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserCart;
