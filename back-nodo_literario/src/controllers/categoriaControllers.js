import { Router } from "express";
import Categoria from "../models/categoria.model.js";

// Obtener todas las categorías activas
const getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: { activa: true },
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria || !categoria.activa) {
      return res
        .status(404)
        .json({ error: "Categoría no encontrada o inactiva" });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
  try {
    const { nombre, imagen, activa } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevaCategoria = await Categoria.create({
      nombre,
      imagen:
        imagen ||
        "https://imgs.search.brave.com/DeOQiOKs3hkSsDn1Q6NSUN5RjWtCzqQvem6HHpaVFdU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAy/MTMxMjc2OC9lcy9m/b3RvL2JsYW5jby1s/aWdlcmFtZW50ZS1h/YmllcnRvLW1hcXVl/dGEtZGUtbGlicm8t/Y29uLXRhcGEtZHVy/YS1jb24tdGV4dHVy/YS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9ZHRRTUdmYnVx/c2RXdGN4cVkzczFU/SkZSVnpZUU5OVmQ2/V1JkN2RjWmlTRT0",
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria || !categoria.activa) {
      return res
        .status(404)
        .json({ error: "Categoría no encontrada o inactiva" });
    }

    if (nombre) categoria.nombre = nombre;
    await categoria.save();

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

// Eliminar (desactivar) una categoría
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria || !categoria.activa) {
      return res
        .status(404)
        .json({ error: "Categoría no encontrada o ya eliminada" });
    }

    // Opción 1: Eliminación lógica
    categoria.activa = false;
    await categoria.save();

    // Opción 2: Eliminación física (borrado permanente)
    // await categoria.destroy();

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};

export {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
