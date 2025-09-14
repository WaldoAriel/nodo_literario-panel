import { Router } from "express";
import {
  Categoria,
  Libro,
  Autor,
  Editorial,
  LibroAutor,
} from "../models/index.js";
import ImagenProducto from "../models/imagenProducto.models.js";

// Obtener todas las libros activas
const getAllLibros = async (req, res) => {
  try {
    const { id_categoria, page = 1, limit = 10 } = req.query; // page y limit
    let whereClause = { activa: true };

    if (id_categoria) {
      whereClause.id_categoria = id_categoria;
    }

    // Convertir a números y calcular offset
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // usamos findAndCountAll para obtener datos + total count
    const { count, rows: libros } = await Libro.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ImagenProducto,
          as: "imagenes",
          attributes: ["id", "urlImagen"],
          limit: 1,
          required: false,
        },
        {
          model: Categoria,
          as: "categoria",
          attributes: ["nombre"],
        },
        {
          model: Editorial,
          as: "editorial",
          attributes: ["nombre"],
        },
        {
          model: Autor,
          as: "autores",
          attributes: ["id", "nombre", "apellido"],
          through: { attributes: [] },
        },
      ],
      limit: limitNumber,
      offset: offset,
      order: [["id", "DESC"]], // Ordena por ID descendente
    });

    // Transformar datos para el front
    const librosTransformados = libros.map((libro) => {
      const libroPlain = libro.get({ plain: true });
      return {
        ...libroPlain,
        imagen:
          libroPlain.imagenes && libroPlain.imagenes.length > 0
            ? libroPlain.imagenes[0].urlImagen
            : "/placeholder-image.jpg",
        autor:
          libroPlain.autores && libroPlain.autores.length > 0
            ? `${libroPlain.autores[0].nombre} ${libroPlain.autores[0].apellido}`
            : "Autor desconocido",
      };
    });

    // devuelve respuesta paginada
    res.json({
      libros: librosTransformados,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("❌ Error al obtener libros:", error);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
};

// Obtener libro por id
const getLibroById = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id, {
      include: [
        {
          model: ImagenProducto,
          as: "imagenes",
          attributes: ["id", "urlImagen"],
        },
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Editorial, as: "editorial", attributes: ["id", "nombre"] },
        {
          model: Autor,
          as: "autores",
          attributes: ["id", "nombre", "apellido"],
          through: { attributes: [] }, //  para relaciones muchos a muchos, para no traer datos de la tabla intermedia
        },
      ],
    });
    if (!libro || !libro.activa) {
      return res.status(404).json({ error: "Libro no encontrado o inactivo" });
    }
    res.json(libro);
  } catch (error) {
    console.error("Error al obtener el libro", error);
    res.status(500).json({ error: "Error al obtener el libro" });
  }
};

const createLibro = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  console.log("Imagen URL recibida:", req.body.imagenUrl);
  try {
    const {
      id_categoria,
      titulo,
      isbn,
      descripcion,
      id_editorial,
      precio,
      stock,
      activa,
      oferta,
      descuento,
      autores,
      imagenUrl,
    } = req.body;

    if (!id_categoria) {
      return res.status(400).json({ error: "el ID de categoría es requerido" });
    }
    if (!id_editorial) {
      return res.status(400).json({ error: "El ID de editorial es requerido" });
    }
    if (!titulo) {
      return res
        .status(400)
        .json({ error: "El título del libro es requerido" });
    }

    const nuevaLibro = await Libro.create({
      id_categoria,
      titulo,
      isbn,
      descripcion,
      id_editorial,
      precio,
      stock,
      activa,
      oferta,
      descuento,
    });

    // manejo de imégenes

    if (imagenUrl) {
      try {
        await ImagenProducto.create({
          id_libro: nuevaLibro.id,
          urlImagen: imagenUrl,
          esPortada: true,
        });
        console.log("Imagen de portada creada correctamente");
      } catch (error) {
        console.error("Error creando imagen:", error);
      }
    }

    // manejo de autores
    if (autores && Array.isArray(autores) && autores.length > 0) {
      try {
        // Crear relaciones en la tabla intermedia LibroAutor
        const relacionesAutores = autores.map((id_autor) => ({
          id_libro: nuevaLibro.id,
          id_autor: id_autor,
        }));

        await LibroAutor.bulkCreate(relacionesAutores);
        console.log("Relaciones con autores creadas correctamente");
      } catch (error) {
        console.error("Error creando relaciones con autores:", error);
      }
    }

    res.status(201).json(nuevaLibro);
  } catch (error) {
    console.error("❌ Error al crear libro:", error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
};

// Actualizar libro
const updateLibro = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  console.log("Imagen URL recibida:", req.body.imagenUrl);
  try {
    const { id } = req.params;
    const {
      id_categoria,
      titulo,
      isbn,
      descripcion,
      id_editorial,
      precio,
      stock,
      activa,
      descuento,
      oferta,
      autores,
      imagenUrl,
    } = req.body;

    const libro = await Libro.findByPk(id);

    if (!libro || !libro.activa) {
      return res.status(404).json({ error: "Libro no encontrado o inactivo" });
    }

    // Actualizar campos simples
    if (id_categoria !== undefined) libro.id_categoria = id_categoria;
    if (titulo !== undefined) libro.titulo = titulo;
    if (isbn !== undefined) libro.isbn = isbn;
    if (descripcion !== undefined) libro.descripcion = descripcion;
    if (id_editorial !== undefined) libro.id_editorial = id_editorial;
    if (precio !== undefined) libro.precio = precio;
    if (stock !== undefined) libro.stock = stock;
    if (activa !== undefined) libro.activa = activa;
    if (oferta !== undefined) libro.oferta = oferta;
    if (descuento !== undefined) libro.descuento = descuento;

    await libro.save();
    // manejo de imágenes
    if (imagenUrl !== undefined) {
      try {
        // Buscar si ya existe una imagen portada
        const imagenExistente = await ImagenProducto.findOne({
          where: { id_libro: libro.id, esPortada: true },
        });

        if (imagenExistente) {
          // Actualizar imagen existente
          imagenExistente.urlImagen = imagenUrl;
          await imagenExistente.save();
        } else {
          // Crear nueva imagen portada
          await ImagenProducto.create({
            id_libro: libro.id,
            urlImagen: imagenUrl,
            esPortada: true,
          });
        }
        console.log("Imagen de portada actualizada correctamente");
      } catch (error) {
        console.error("Error actualizando imagen:", error);
      }
    }
    // manejo de autores
    if (autores !== undefined) {
      try {
        // se eliminan relaciones existentes
        await LibroAutor.destroy({
          where: { id_libro: libro.id },
        });

        // creamos nuevas relaciones solo si hay autores
        if (Array.isArray(autores) && autores.length > 0) {
          const relacionesAutores = autores.map((id_autor) => ({
            id_libro: libro.id,
            id_autor: id_autor,
          }));

          await LibroAutor.bulkCreate(relacionesAutores);
        }
        console.log("Relaciones con autores actualizadas correctamente");
      } catch (error) {
        console.error("Error actualizando relaciones con autores:", error);
      }
    }

    res.json(libro);
  } catch (error) {
    console.error("❌ Error al actualizar libro:", error);
    res.status(500).json({ error: "Error al actualizar el libro" });
  }
};

// Eliminar libro
const deleteLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findByPk(id);

    if (!libro || !libro.activa) {
      return res
        .status(404)
        .json({ error: "Libro no encontrado o ya eliminado" });
    }

    // Eliminación lógica
    libro.activa = false;
    await libro.save();

    //  Eliminación física (se borra permanente)
    // await libro.destroy();

    res.json({ message: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la libro" });
  }
};

export { getAllLibros, getLibroById, createLibro, updateLibro, deleteLibro };
