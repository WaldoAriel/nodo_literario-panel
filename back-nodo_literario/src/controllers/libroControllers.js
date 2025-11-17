import { Router } from "express";
import {
  Categoria,
  Libro,
  Autor,
  Editorial,
  LibroAutor,
  ImagenProducto,
} from "../models/index.js";
import { Op } from "sequelize";
import { sequelize } from "../models/index.js";

// Obtener todas las libros activas
const getAllLibros = async (req, res) => {
  try {
    // parámetros de ordenamiento Y FILTROS
    const {
      id_categoria,
      page = 1,
      limit = 10,
      sortBy = "titulo",
      sortDirection = "asc",
      search, // Búsqueda por título
      autor, // Filtro por autor
      precioMin, // Precio mínimo
      precioMax, // Precio máximo
    } = req.query;

    let whereClause = { activa: true };

    if (id_categoria) {
      whereClause.id_categoria = id_categoria;
    }

    // 👇 Aplicar filtro de búsqueda por título
    if (search) {
      whereClause.titulo = {
        [Op.like]: `%${search}%`,
      };
    }

    // 👇 Aplicar filtro de precio
    if (precioMin !== undefined || precioMax !== undefined) {
      whereClause.precio = {};
      if (precioMin !== undefined) {
        whereClause.precio[Op.gte] = parseFloat(precioMin);
      }
      if (precioMax !== undefined) {
        whereClause.precio[Op.lte] = parseFloat(precioMax);
      }
    }

    // Convertir a números y calcular offset
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // cláusula de ordenamiento
    const order = [[sortBy, sortDirection.toUpperCase()]];

    // 👇 PREPARAR INCLUDE PARA AUTORES
    const include = [
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
    ];

    // 👇 SI HAY FILTRO POR AUTOR, AGREGAR WHERE AL INCLUDE
    if (autor) {
      include[3].where = {
        [Op.or]: [
          { nombre: { [Op.like]: `%${autor}%` } },
          { apellido: { [Op.like]: `%${autor}%` } },
        ],
      };
    }

    // findAndCountAll para obtener datos + total count
    const { count, rows: libros } = await Libro.findAndCountAll({
      where: whereClause,
      include: include, // 👈 Usar el include que preparamos
      limit: limitNumber,
      offset: offset,
      order: order,
      distinct: true, // IMPORTANTE: Para contar correctamente con includes
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

    // respuesta paginada
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
          through: { attributes: [] }, // para relaciones muchos a muchos, para no traer datos de la tabla intermedia
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
  const transaction = await sequelize.transaction();
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
    } = req.body;
    const imagenes = req.files;

    if (!id_categoria || !id_editorial || !titulo) {
      return res
        .status(400)
        .json({ error: "Los campos requeridos no fueron proporcionados" });
    }
    if (!imagenes || imagenes.length === 0) {
      return res
        .status(400)
        .json({ error: "Se requiere al menos una imagen para el libro" });
    }

    const nuevaLibro = await Libro.create(
      {
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
      },
      { transaction }
    );

    // Manejo de imágenes
    if (imagenes && imagenes.length > 0) {
      const imagenesPromises = imagenes.map((imagen, index) => {
        const urlImagen = `/uploads/libros/${imagen.filename}`;
        const esPortada = index === 0; // La primera imagen es la portada
        return ImagenProducto.create(
          {
            id_libro: nuevaLibro.id,
            urlImagen: urlImagen,
            esPortada: esPortada,
          },
          { transaction }
        );
      });
      await Promise.all(imagenesPromises);
    }

    // Manejo de autores
    if (autores && Array.isArray(autores) && autores.length > 0) {
      const relacionesAutores = autores.map((id_autor) => ({
        id_libro: nuevaLibro.id,
        id_autor: id_autor,
      }));
      await LibroAutor.bulkCreate(relacionesAutores, { transaction });
    }

    // 👇 NUEVO: Obtener el libro completo con relaciones para la notificación
    const libroCompleto = await Libro.findByPk(nuevaLibro.id, {
      include: [
        {
          model: Autor,
          as: "autores",
          through: { attributes: [] },
        },
        {
          model: ImagenProducto,
          as: "imagenes",
        },
      ],
      transaction,
    });

    await transaction.commit();

    // Emitir notificación DESPUÉS del commit exitoso
    const io = req.app.get("io");
    if (io) {
      io.emit("nuevo-libro", {
        id: libroCompleto.id,
        titulo: libroCompleto.titulo,
        autores: libroCompleto.autores || [
          { nombre: "Autor", apellido: "Desconocido" },
        ],
        precio: parseFloat(libroCompleto.precio).toLocaleString("es-AR"),
        imagen:
          libroCompleto.imagenes?.[0]?.urlImagen || "/placeholder-book.jpg",
        fecha: new Date().toLocaleTimeString("es-AR"),
      });

      console.log(
        "📢 Notificación enviada para nuevo libro:",
        libroCompleto.titulo
      );
    }

    res.status(201).json(libroCompleto);
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error al crear libro:", error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
};

// Actualizar libro
const updateLibro = async (req, res) => {
  const transaction = await sequelize.transaction();
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
      imagesToRemove,
    } = req.body;
    const imagenes = req.files;

    const libro = await Libro.findByPk(id, { transaction });

    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    // Actualiza campos simples
    await libro.update(
      {
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
      },
      { transaction }
    );

    // 🔽 NUEVO CÓDIGO: Manejar eliminación de imágenes existentes
    if (imagesToRemove && imagesToRemove.length > 0) {
      const imagesToRemoveArray = Array.isArray(imagesToRemove)
        ? imagesToRemove
        : [imagesToRemove];

      await ImagenProducto.destroy({
        where: {
          id_libro: libro.id,
          urlImagen: imagesToRemoveArray,
        },
        transaction,
      });
    }
    // 🔼 FIN NUEVO CÓDIGO

    // Manejo de imágenes (si se subieron nuevas)
    if (imagenes && imagenes.length > 0) {
      // 🔽 CÓDIGO MODIFICADO: Ya NO eliminamos todas las imágenes
      // Solo agregamos las nuevas, manteniendo las existentes que no se eliminaron

      // Obtener imágenes existentes para determinar si alguna es portada
      const imagenesExistentes = await ImagenProducto.findAll({
        where: { id_libro: libro.id },
        transaction,
      });

      const tieneImagenesExistentes = imagenesExistentes.length > 0;

      // Crear nuevas imágenes
      const imagenesPromises = imagenes.map((imagen, index) => {
        const urlImagen = `/uploads/libros/${imagen.filename}`;
        // Si no hay imágenes, la primera nueva va a ser portada
        const esPortada = index === 0 && !tieneImagenesExistentes;
        return ImagenProducto.create(
          {
            id_libro: libro.id,
            urlImagen: urlImagen,
            esPortada: esPortada,
          },
          { transaction }
        );
      });
      await Promise.all(imagenesPromises);
    }

    // Manejo de autores
    if (autores !== undefined) {
      await LibroAutor.destroy({ where: { id_libro: libro.id }, transaction });
      if (Array.isArray(autores) && autores.length > 0) {
        const relacionesAutores = autores.map((id_autor) => ({
          id_libro: libro.id,
          id_autor: id_autor,
        }));
        await LibroAutor.bulkCreate(relacionesAutores, { transaction });
      }
    }

    await transaction.commit();
    res.json(libro);
  } catch (error) {
    await transaction.rollback();
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

    // Eliminación física (se borra permanente)
    // await libro.destroy();

    res.json({ message: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la libro" });
  }
};

export { getAllLibros, getLibroById, createLibro, updateLibro, deleteLibro };
