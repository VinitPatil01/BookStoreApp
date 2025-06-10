import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import './App.css'
import Navbar from './components/navbax';
import BookDetail from "./components/bookDetail";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/dashboard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import AdminBooksList from "./components/admin/AdminBooksList";
import AdminUserCart from "./components/admin/AdminUserCart";
import AdminCategoryPanel from "./components/admin/AdminCategoryPanel";
import ContactForm from "./components/ContactForm";
function App() {
  return (
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />  
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin/books" element={<AdminBooksList />} />
        <Route path="/admin/user-cart" element={<AdminUserCart />} />
        <Route path="/admin/categories" element={<AdminCategoryPanel />} />
        <Route path="/contact" element={<ContactForm />} />

        

      </Routes>
    </Router>
  )
}

export default App
