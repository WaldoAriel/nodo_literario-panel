import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';

export const libroService = {
  // Obtener libros con paginación
  getLibros: (page = 1, limit = 10) => 
    axios.get(`${API_URL}/libros?page=${page}&limit=${limit}`),
  
  // Crear libro
  createLibro: (libroData) => 
    axios.post(`${API_URL}/libros`, libroData),
  
  // Actualizar libro
  updateLibro: (id, libroData) => 
    axios.put(`${API_URL}/libros/${id}`, libroData),
  
  // Eliminar libro
  deleteLibro: (id) => 
    axios.delete(`${API_URL}/libros/${id}`),
  
  // Obtener un libro por ID
  getLibroById: (id) => 
    axios.get(`${API_URL}/libros/${id}`)
};