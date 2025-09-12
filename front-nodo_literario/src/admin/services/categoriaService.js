import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const categoriaService = {
  getCategorias: (page = 1, limit = 10) => 
    axios.get(`${API_URL}/categorias?page=${page}&limit=${limit}`),
  
  createCategoria: (categoriaData) => 
    axios.post(`${API_URL}/categorias`, categoriaData),
  
  updateCategoria: (id, categoriaData) => 
    axios.put(`${API_URL}/categorias/${id}`, categoriaData),
  
  deleteCategoria: (id) => 
    axios.delete(`${API_URL}/categorias/${id}`),
  
  getCategoriaById: (id) => 
    axios.get(`${API_URL}/categorias/${id}`)
};