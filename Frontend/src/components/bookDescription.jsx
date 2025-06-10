import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllBooks, searchBooks } from '../services/bookService';
import { getToken } from '../services/userService';
import { useCart } from './CartContext';
import axios from 'axios';

const BookDescription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');
  const categoryId = queryParams.get('category');
  const token = getToken();
  const [books, setBooks] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { cart, addToCart, updateQuantity, loading: cartLoading } = useCart();

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const getCartItem = (bookId) => {
    return cart.find(item => item.book.bookId === bookId);
  };

  const handleAddToCart = (book) => {
    console.log(book);
    addToCart(book);
  };

  const handleQuantityUpdate = async (bookId, newQuantity) => {
    updateQuantity(bookId, newQuantity);
  };

  // Fetch books by category
  const fetchBooksByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9090/api/categories/${categoryId}`);
      setBooks(response.data.books || []);
      setCurrentCategory(response.data);
    } catch (error) {
      console.error("Error fetching books by category:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let response;
        
        if (categoryId) {
          // Fetch books by category
          await fetchBooksByCategory(categoryId);
          return;
        } else if (searchQuery) {
          // Search books
          response = await searchBooks(searchQuery, token);
          setCurrentCategory(null);
        } else {
          // Get all books
          response = await getAllBooks();
          setCurrentCategory(null);
        }
        
        setBooks(response?.data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery, categoryId, token]);

  const getHeaderText = () => {
    if (currentCategory) {
      return {
        title: `${currentCategory.name} Books`,
        subtitle: `Discover amazing ${currentCategory.name.toLowerCase()} books in our collection.`
      };
    } else if (searchQuery) {
      return {
        title: `Search Results for "${searchQuery}"`,
        subtitle: `Found ${books.length} book${books.length !== 1 ? 's' : ''} matching your search.`
      };
    } else {
      return {
        title: 'Our Book List',
        subtitle: 'From timeless classics to modern masterpieces, find the perfect read for every moment.'
      };
    }
  };

  const headerText = getHeaderText();

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
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
                {headerText.title.includes('Our') ? (
                  <>Our <span className="text-gray-600">Book List</span></>
                ) : (
                  headerText.title
                )}
              </h1>
              <p className="text-gray-600 max-w-md">
                {headerText.subtitle}
              </p>
              
              {/* Category info */}
              {currentCategory && (
                <div className="mt-3 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {currentCategory.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {books.length} book{books.length !== 1 ? 's' : ''} available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Clear filters */}
          {(searchQuery || categoryId) && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <button
                  onClick={() => navigate('/')}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  Search: "{searchQuery}" ✕
                </button>
              )}
              {categoryId && currentCategory && (
                <button
                  onClick={() => navigate('/')}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  Category: {currentCategory.name} ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* No books found message */}
        {books.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No books match your search for "${searchQuery}"`
                : currentCategory 
                ? `No books available in ${currentCategory.name} category`
                : 'No books available at the moment'
              }
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Browse All Books
            </button>
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => {
              const cartItem = getCartItem(book.bookId);
              const isInCart = !!cartItem;
              const quantity = cartItem?.quantity || 0;

              return (
                <div
                  key={book.bookId}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="rounded-2xl overflow-hidden shadow-md bg-white">
                    <div className="h-64 overflow-hidden flex items-center justify-center bg-gray-100">
                      <img
                        src={book.coverImageUrl || "/placeholder.png"}
                        alt={book.title}
                        className="object-contain h-full w-full"
                      />
                    </div>

                    <div className="p-4" onClick={() => handleBookClick(book.bookId)}>
                      <h4 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Category: {book.category?.name}</p>
                    </div>

                    <div className="p-4">
                      {isInCart ? (
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => handleQuantityUpdate(book.bookId, quantity - 1)}
                            disabled={cartLoading}
                            className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-700 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-lg font-medium min-w-[2rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(book.bookId, quantity + 1)}
                            disabled={cartLoading}
                            className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-700 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(book)}
                          disabled={cartLoading}
                          className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {cartLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDescription;