import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const relacionesService = {
  getCategorias: () => axios.get(`${API_URL}/categorias`),
  getEditoriales: () => axios.get(`${API_URL}/editoriales`),
  getAutores: () => axios.get(`${API_URL}/autores`)
};