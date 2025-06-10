import axios from "axios";
import { getToken } from "./userService";

export async function getAllBooks(){
    return axios.get(`http://localhost:9090/api/books/public`);
}

export async function getBooksById(id,token){
    return axios.get(`http://localhost:8080/api/books/public/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
    });
}


export async function searchBooks(searchQuery,token){
    return axios.get(`http://localhost:9090/api/books/public/search`,{
                params: {keyword: searchQuery},
                headers: {Authorization:`Bearer ${token}`}
              });
            
            }


const API_URL = "http://localhost:9090/api/books/admin";

const token = getToken();

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});


export const getAllBooksAdmin = () => {
  return axiosInstance.get('/all');
};

export const deleteBookAdmin = (id) => {
  return axiosInstance.delete(`/${id}`);
};

export const getBooksBySellerEmail = (sellerEmail) => {
  return axiosInstance.get(`/seller/${sellerEmail}`);
};