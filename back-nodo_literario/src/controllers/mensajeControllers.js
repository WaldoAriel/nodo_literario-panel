import { Mensaje } from "../models/index.js";

// Todos los mensajes
const getMensajesByLibroId = async (req, res) => {
  try {
    const { libroId } = req.params;
    const mensajes = await Mensaje.findAll({
      where: {
        libroId: libroId,
      },
    });
    res.status(200).json(mensajes);
  } catch (error) {
    console.error("Error al obtener mensajes", error);
    res
      .status(500)
      .json({ Error: "Error interno del servidor al obtener los mensajes" });
  }
};

// mensaje nuevo
const createMensaje = async (req, res) => {
  try {
    const { libroId } = req.params;
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ Error: 'El campo "Texto" es requerido.' });
    }

    const nuevoMensaje = await Mensaje.create({
      libroId,
      texto,
    });
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error("Error al crear el mensaje", error);
    res
      .status(500)
      .json({ Error: "Error interno del servidor al crear el mensaje" });
  }
};

export { getMensajesByLibroId, createMensaje };
