
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import  { useCart } from "./CartContext"; 
import axios from "axios";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/books/public/${id}`);
        console.log(response.data);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError("Book not found");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error || !book) return <div className="text-center py-8">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Books</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Cover */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-80 h-96 object-cover rounded-2xl shadow-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback Div */}
              <div
                className={`${book.bgColor || "bg-purple-200"} rounded-2xl p-8 w-80 h-96 ${
                  book.textColor || "text-black"
                } shadow-xl hidden`}
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-4 leading-tight">
                      {book.title}
                    </h1>
                    {book.subtitle && (
                      <p className="text-lg opacity-80 mb-6">
                        {book.subtitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="opacity-70">{book.author}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{book.subtitle}</p>
              <p className="text-lg text-gray-700">by {book.author}</p>
            </div>

            <div className="text-3xl font-bold text-purple-600">
              ₹{book.price}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900">Publisher:</span>
                <span className="text-gray-700 ml-2">{book.author}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">ISBN:</span>
                <span className="text-gray-700 ml-2">{book.bookId}</span>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                onClick={() => addToCart(book)}
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
