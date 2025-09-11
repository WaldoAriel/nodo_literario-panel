import Cupon from "../models/cuponDesc.model.js";
import { Router } from "express";

// todos los cupones
const getAllCupones = async (req, res) => {
  try {
    const cupones = await Cupon.findAll();
    res.json(cupones);
  } catch (error) {
    console.error("❌ Error al obtener cupones", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener los cupones" });
  }
};

// cupón por ID
const getCuponById = async (req, res) => {
  try {
    const { id } = req.params;
    const cupon = await Cupon.findByPk(id);
    if (!cupon || !cupon.activo) {
      return res.status(404).json({ error: "Cupón no encontrado o inactivo" });
    }
    res.json(cupon);
  } catch (error) {
    res.status(500).json({ error: "error al obtener los cupones" });
  }
};

// crear cupón

const createCupon = async (res, req) => {
  try {
    const { libroId, nombre, codigo, descuento, activo } = req.body;
    if(!nombre || !activo){
        return res.status(400).json({error: 'El nombre es requerido'})
    }
  } catch (error) {
    console.error('Error al crear el Cupón', error)
    res.status(500).json({error: 'Error al crear el Cupón'})
  }
};
