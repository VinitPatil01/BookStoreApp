import React, { useState } from "react";
import { getUserRole } from "../utils/auth";
import BookDescription from "./bookDescription";
import SellerDashboard from "./SellerDashboard";
import AdminUsers from "./AdminUsers";
import AdminBooksList from "./admin/AdminBooksList";
import AdminUserCart from "./admin/AdminUserCart";
import AdminCategoryPanel from "./admin/AdminCategoryPanel";

const Dashboard = () => {
  const role = getUserRole();
  const [activeSection, setActiveSection] = useState("overview");

  const renderAdminContent = () => {
    switch (activeSection) {
      case "users":
        return <AdminUsers />;
      case "books":
        return <AdminBooksList />;
      case "user-cart":
        return <AdminUserCart />;
      case "categories":
        return <AdminCategoryPanel />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Welcome to Admin Dashboard</h2>
            <p className="text-gray-600">Select a section from the navigation above to get started.</p>
          </div>
        );
    }
  };

  const renderSellerContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <SellerDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Welcome to Seller Dashboard</h2>
            <p className="text-gray-600">Manage your books and orders here.</p>
          </div>
        );
    }
  };

  const renderBuyerContent = () => {
    switch (activeSection) {
      case "books":
        return <BookDescription />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Welcome to Book Store</h2>
            <p className="text-gray-600">Browse and discover amazing books.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {role?.replace('ROLE_', '')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === "ROLE_ADMIN" && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveSection("overview")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "overview"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection("users")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "users"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  User Management
                </button>
                <button
                  onClick={() => setActiveSection("books")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "books"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Books Management
                </button>
                <button
                  onClick={() => setActiveSection("user-cart")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "user-cart"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  User Carts
                </button>
                <button
                  onClick={() => setActiveSection("categories")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "categories"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Categories
                </button>
              </nav>
            </div>
            <div className="mt-6">
              {renderAdminContent()}
            </div>
          </div>
        )}

        {role === "ROLE_SELLER" && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveSection("overview")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "dashboard"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Seller Dashboard
                </button>
              </nav>
            </div>
            <div className="mt-6">
              {renderSellerContent()}
            </div>
          </div>
        )}

        {role === "ROLE_BUYER" && (
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveSection("overview")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "overview"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection("books")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeSection === "books"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Browse Books
                </button>
              </nav>
            </div>
            <div className="mt-6">
              {renderBuyerContent()}
            </div>
          </div>
        )}

        {!role && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Access Denied</h2>
            <p className="text-gray-600">Please log in to access the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;