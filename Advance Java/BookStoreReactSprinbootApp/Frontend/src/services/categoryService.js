import axios from 'axios';
const API = 'http://localhost:9090/api/categories';

export const getAllCategories = () => axios.get(API);
export const getCategoryById = (id) => axios.get(`${API}/${id}`);
export const getCategoryByName = (name) => axios.get(`${API}/search?name=${name}`);
export const createCategory = (category) => axios.post(API, category);
export const updateCategory = (id, category) => axios.put(`${API}/${id}`, category);
export const deleteCategory = (id) => axios.delete(`${API}/${id}`);
