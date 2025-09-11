import ImagenProducto from "../models/imagenProducto.models.js";
import Libro from "../models/libro.model.js";

const getAllImagenes = async (req, res) => {
  try {
    const {libroId} = req.params
    const imagenesProd = await ImagenProducto.findAll({
      where: {id_libro: libroId}
    });
    res.json(imagenesProd);
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las imágenes de la galería" });
  }
};

const getImagenesById = async (req, res) => {
  try {
    const { id } = req.params;
    const imagenesProd = await ImagenProducto.findByPk(id);

    if (!imagenesProd) {
      return res.status(400).json({ error: "Imágenes no encontradas" });
    }
    res.json(imagenesProd);
  } catch (error) {
    console.error("Error al obtener la imagen", error);
    res.status(500).json({ error: "Error al obtener la imagen de la galería" });
  }
};

const createImagenProd = async (req, res) => {
  try {
    const { urlImagen } = req.body;
    const {libroId} = req.params

    if (!urlImagen || !libroId) {
      return res.status(400).json({
        error: "Los campos urlImagen y libroId son obligatorios",
      });
    }
    // verifico si el libro existe antes de crear la imagen
    const libroExistente = await Libro.findByPk(libroId);
    if (!libroExistente) {
      return res.status(404).json({ error: "El libro especificado no existe." });
    }

    const nuevaImagen = await ImagenProducto.create({
      urlImagen,
      id_libro: libroId,
    });
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error("Error al crear la imagen", error);
    res.status(500).json({ error: "Error al crear la imagen en la galería" });
  }
};

export { getAllImagenes, getImagenesById, createImagenProd };
