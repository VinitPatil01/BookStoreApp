import React, { useEffect, useState, useRef } from 'react';
import {
  Search, Home, ShoppingBag, Mail, ShoppingCart, User,
  BookOpen, Code, Target, Clock, Atom, ChevronDown, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';
import { getUserRole } from '../utils/auth';
import { getToken } from '../services/userService';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(getToken() != null);
  const userRole = getUserRole();

  const dropdownRef = useRef(null);

  const categories = [
    { name: "Fiction", icon: BookOpen, color: "text-purple-600" },
    { name: "Programming", icon: Code, color: "text-green-600" },
    { name: "Self-Help", icon: Target, color: "text-blue-600" },
    { name: "History", icon: Clock, color: "text-amber-600" },
    { name: "Science", icon: Atom, color: "text-red-500" }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/categories");
        setFetchedCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
    console.log(userRole);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoriesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate('/cart');
  };
  
  const handleOrdersClick = () => {
    navigate('/orders');
  };

  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    setShowCategoriesDropdown(false);
  };

  const toggleCategoriesDropdown = () => {
    setShowCategoriesDropdown(prev => !prev);
    setShowSearch(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/?search=${encodeURIComponent(searchText.trim())}`);
      setShowSearch(false);
    }
  };

  const handleCategorySubmit = () => {
    if (selectedCategory) {
      navigate(`/?category=${selectedCategory}`);
      setShowCategoriesDropdown(false);
      setSelectedCategory('');
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/?category=${categoryId}`);
    setShowCategoriesDropdown(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 transform rotate-45 rounded-sm"></div>
              <span className="text-xl font-bold text-gray-900">Bacala</span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-purple-600 border-b-2 border-purple-600 pb-1"
              >
                <Home size={18} />
                <span className="font-medium">Home</span>
              </button>

              {/* Categories Dropdown */}
              {userRole == "ROLE_BUYER" && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleCategoriesDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <ShoppingBag size={18} />
                    <span className="font-medium">Categories</span>
                    <ChevronDown size={16} className={`transform transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCategoriesDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Category</h3>
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                          {fetchedCategories.map((category) => (
                            <button
                              key={category.categoryId}
                              onClick={() => handleCategoryClick(category.categoryId)}
                              className="w-full text-left px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700"
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                        <div className="border-t pt-3">
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                          >
                            <option value="">Choose a category...</option>
                            {fetchedCategories.map((category) => (
                              <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleCategorySubmit}
                            disabled={!selectedCategory}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            View Books
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => navigate("/about")}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <User size={18} />
                <span className="font-medium">About Us</span>
              </button>
              <button 
                onClick={() => navigate("/contact")}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Mail size={18} />
                <span className="font-medium">Contact Us</span>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-purple-600 transition-colors" onClick={toggleSearch}>
                <Search size={20} />
              </button>

              {isLoggedIn ? (
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={handleLogout}
                >
                  <User size={18} />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              ) : (
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => {
                    navigate("/login");
                    localStorage.clear();
                  }}
                >
                  <User size={18} />
                  <span className="hidden sm:inline font-medium">Login</span>
                </button>
              )}
              
              <button
                type="button"
                className="relative flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCartClick();
                }}
              >
                <div className="relative">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium">Cart</span>
              </button>

              {/* Orders button with icon */}
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Orders button clicked'); // Debug log
                  handleOrdersClick();
                }}
              >
                <Package size={18} />
                <span className="hidden sm:inline font-medium">Orders</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Section */}
      {showSearch && (
        <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Your Perfect Book</h2>
              <p className="text-gray-600">Search through thousands of books, authors, and genres</p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                  placeholder="Search books, authors, genres..."
                  className="block w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-2xl leading-6 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                />
                <button type="button" onClick={handleSearchSubmit} className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                    <Search className="h-5 w-5" />
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-3">Popular searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {fetchedCategories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => {
                      setSearchText(category.name);
                      handleSearchSubmit({ preventDefault: () => { } });
                    }}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <button onClick={toggleSearch} className="text-gray-500 hover:text-gray-700 text-sm underline">
                Close Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      {!showSearch && !showCategoriesDropdown && userRole == "ROLE_BUYER" && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories:</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {categories.map(({ name, icon: Icon, color }) => (
                <div key={name} className="flex flex-col items-center space-y-2 cursor-pointer group">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <Icon className={`w-6 h-6 ${color} group-hover:text-purple-500 transition-colors`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;