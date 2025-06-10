import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';
import axios from 'axios';

const AdminCategoryPanel = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCategories = async () => {
    const res = await getAllCategories();
    console.log(res.data);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isEditing) {
      await createCategory(formData);
      setFormData({ name: '', description: '' });
      fetchCategories();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
      console.log("in update")
      const updateData = {
        categoryId: editId,
        name: formData.name,
        description: formData.description
      };
      
      try {
          const response = await axios.put(`http://localhost:9090/api/categories/${editId}`,updateData);
          console.log(response.data);
          console.log('Category updated successfully');
          setFormData({ name: '', description: '' });
          setEditId(null);
          setIsEditing(false);
          fetchCategories();

      } catch (error) {
        console.error('Error updating category:', error);
      }
    
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, description: cat.description });
    setEditId(cat.categoryId);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditId(null);
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin: Category Management</h2>
      
      <form className="mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        
        {!isEditing ? (
          <button
            type="submit"
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Add
          </button>
        ) : (
          <>
            <button
              type="submit"
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.categoryId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{cat.name}</td>
                <td className="px-4 py-2 border">{cat.description}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-yellow-400 px-2 py-1 rounded mr-2"
                    disabled={isEditing}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.categoryId)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    disabled={isEditing}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoryPanel;