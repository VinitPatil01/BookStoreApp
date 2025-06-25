import React, { useEffect, useState } from "react";

const AdminBookDelete = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend API URL (adjust as per your backend config)
const API_BASE = "http://localhost:8080/api/books";

  // Fetch all books
const fetchBooks = async () => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Delete book by id
  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`${API_BASE}/${bookId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete book");
      // Remove deleted book from UI
      setBooks(books.filter((book) => book.id !== bookId));
      alert("Book deleted successfully!");
    } catch (err) {
      alert("Error deleting book: " + err.message);
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Admin - Manage Books (Delete)</h2>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(({ id, title, author }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{author}</td>
                <td>
                  <button onClick={() => handleDelete(id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBookDelete;
