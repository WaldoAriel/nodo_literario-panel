import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const autorService = {
  getAutores: (page = 1, limit = 10) => 
    axios.get(`${API_URL}/autores?page=${page}&limit=${limit}`),
  
  createAutor: (autorData) => 
    axios.post(`${API_URL}/autores`, autorData),
  
  updateAutor: (id, autorData) => 
    axios.put(`${API_URL}/autores/${id}`, autorData),
  
  deleteAutor: (id) => 
    axios.delete(`${API_URL}/autores/${id}`),
  
  getAutorById: (id) => 
    axios.get(`${API_URL}/autores/${id}`)
};