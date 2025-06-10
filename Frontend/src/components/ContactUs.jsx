import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [responseMsg, setResponseMsg] = useState("");

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const text = await response.text();
      setResponseMsg(text);
      setFormData({ fullName: "", email: "", message: "" });
    } catch (error) {
      setResponseMsg("Failed to send message. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Contact Info */}
        <div className="space-y-4">
          <p className="text-gray-700">
            Thank you for visiting our Book Store Management System. If you have
            any questions, suggestions, or encounter any issues, feel free to
            reach out to us. We’re here to help you!
          </p>
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              Our Office
            </h2>
            <p className="text-gray-600">📍 Pune, Maharashtra, India</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Email</h2>
            <p className="text-gray-600">📧 bookstoreteam@gmail.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Phone</h2>
            <p className="text-gray-600">📞 +91 98765 43210</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Type your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {responseMsg && (
        <div className="text-center text-green-600 font-semibold mt-6">
          {responseMsg}
        </div>
      )}

      <hr className="my-10" />

      <div className="text-center text-gray-600 text-sm">
        Developed by Shreyas Agharkar, Gaurav & Vinit Patil <br />
        © {new Date().getFullYear()} Bacala Bookstore. All rights reserved.
      </div>
    </div>
  );
};

export default ContactUs;
