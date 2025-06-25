import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, Package, X } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../services/userService';
import { toast, ToastContainer } from 'react-toastify';

const SellerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    coverImageUrl: ''
  });
  const token = getToken();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9090/api/books/seller/my-books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching seller books:', error);
    }
    setLoading(false);
  };

  const handleAddOrEditBook = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:9090/api/books/seller/${editingBookId}`, bookData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Book updated successfully!');
      } else {
        await axios.post('http://localhost:9090/api/books/seller', bookData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Book added successfully!');
      }
      setShowForm(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      toast.error('Failed to save book. Please try again.');
    }
  };

  const handleEdit = async (bookId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:9090/api/books/public/${bookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookData({
        ...data,
        categoryId: data.category?.categoryId || '',
      });
      setEditingBookId(bookId);
      setIsEditMode(true);
      setShowForm(true);
    } catch (error) {
      toast.error('Failed to load book for editing.');
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`http://localhost:9090/api/books/seller/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book.');
    }
  };

  const resetForm = () => {
    setBookData({
      title: '',
      author: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      coverImageUrl: ''
    });
    setIsEditMode(false);
    setEditingBookId(null);
  };

  const handleAddNewBook = () => {
    resetForm();
    setShowForm(true);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:9090/api/categories");
      setFetchedCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Seller <span className="text-gray-600">Dashboard</span>
              </h1>
              <p className="text-gray-600 max-w-md">
                Manage your book inventory and track your sales performance.
              </p>
              
              <div className="mt-3 flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <Package className="w-4 h-4 inline mr-1" />
                  {books.length} book{books.length !== 1 ? 's' : ''} in inventory
                </span>
              </div>
            </div>
            
            <button
              onClick={handleAddNewBook}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <PlusCircle className="mr-2 w-5 h-5" /> 
              Add New Book
            </button>
          </div>
        </div>

        {/* No books message */}
        {books.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No books in your inventory</h3>
            <p className="text-gray-600 mb-4">
              Start building your book collection by adding your first book.
            </p>
            <button
              onClick={handleAddNewBook}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Add Your First Book
            </button>
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
              <div
                key={book.bookId}
                className="group transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="rounded-2xl overflow-hidden shadow-md bg-white">
                  <div className="h-64 overflow-hidden flex items-center justify-center bg-gray-100">
                    <img
                      src={book.coverImageUrl || 'https://via.placeholder.com/150'}
                      alt={book.title}
                      className="object-contain h-full w-full"
                    />
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
                      <span className="text-sm text-gray-500">Stock: {book.stock}</span>
                    </div>
                    {book.category && (
                      <p className="text-sm text-gray-500">Category: {book.category.name}</p>
                    )}
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book.bookId)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> 
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.bookId)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> 
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Book Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditMode ? 'Edit Book' : 'Add New Book'}
                  </h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter book title"
                      value={bookData.title || ''}
                      onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      placeholder="Enter author name"
                      value={bookData.author || ''}
                      onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="Enter book description"
                      value={bookData.description || ''}
                      onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={bookData.price || ''}
                        onChange={(e) => setBookData({ ...bookData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={bookData.stock || ''}
                        onChange={(e) => setBookData({ ...bookData, stock: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={bookData.categoryId || ''}
                      onChange={(e) => setBookData({ ...bookData, categoryId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a category...</option>
                      {fetchedCategories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={bookData.coverImageUrl || ''}
                      onChange={(e) => setBookData({ ...bookData, coverImageUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrEditBook}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    {isEditMode ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;