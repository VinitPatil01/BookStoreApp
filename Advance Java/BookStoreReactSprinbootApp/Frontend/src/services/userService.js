import axios from 'axios';

export function getToken(){
    return localStorage.token;
}

export function registerUser(formData){
    return axios.post('http://localhost:9090/users/signup', formData);
}

export function userLogin(formData){
    return axios.post('http://localhost:9090/users/signin',formData)
}

export function storeToken(token){
    
    return localStorage.setItem("token",token)
}

export default getToken();