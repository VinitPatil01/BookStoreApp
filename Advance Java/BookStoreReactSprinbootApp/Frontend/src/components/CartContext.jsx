import React, { useState, useEffect, createContext, useContext } from "react";
import * as cartService from '../services/cartService';
import { getToken } from '../services/userService';

const CartContext = createContext({
  cart: [],
  cartCount: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  addToCart: (bookId, quantity) => {},
  removeFromCart: (cartItemId) => {},
  updateQuantity: (cartItemId, quantity) => {},
  clearCart: () => {},
  fetchCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);

  const fetchCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      console.log(response.data);
      setCart(response.data || []);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book) => {
    try {
  
      setLoading(true);
      setError(null);
      console.log("in cart context");
      await cartService.addToCart(book);
      await fetchCart(); 
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      await cartService.removeFromCart(bookId);
      await fetchCart(); 
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(bookId);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await cartService.updateCartItem(bookId, quantity);
      await fetchCart(); 
    } catch (err) {
      setError('Failed to update cart item');
      console.error('Error updating cart item:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        totalAmount,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;