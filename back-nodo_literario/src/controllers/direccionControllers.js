import { Direccion, Cliente } from "../models/index.js";

// Obtener todas las direcciones (opcionalmente por cliente)
const getAllDirecciones = async (req, res) => {
  try {
    const { id_cliente } = req.query;

    const whereClause = {};

    if (id_cliente) {
      whereClause.id_cliente = id_cliente;
    }

    const direcciones = await Direccion.findAll({
      where: whereClause,
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nombre", "apellido", "email"],
        },
      ],
    });

    res.json(direcciones);
  } catch (error) {
    console.error("❌ Error al obtener direcciones:", error);
    res.status(500).json({ error: "Error al obtener las direcciones" });
  }
};

// Obtener dirección por ID
const getDireccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const direccion = await Direccion.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nombre", "apellido", "email"],
        },
      ],
    });

    if (!direccion) {
      return res.status(404).json({ error: "Dirección no encontrada" });
    }

    res.json(direccion);
  } catch (error) {
    console.error("❌ Error al obtener dirección por ID:", error);
    res.status(500).json({ error: "Error al obtener la dirección" });
  }
};

// Crear una nueva dirección
const createDireccion = async (req, res) => {
  try {
    const {
      calle,
      numero,
      piso,
      departamento,
      ciudad,
      provincia,
      codigo_postal,
      pais,
      es_principal,
      id_cliente,
    } = req.body;

    if (!calle || !numero || !ciudad || !provincia || !codigo_postal || !pais || !id_cliente) {
      return res.status(400).json({
        error:
          "Los campos calle, número, ciudad, provincia, código postal, país y id_cliente son obligatorios",
      });
    }

    // Si es_principal es true, marcamos todas las demás como false para este cliente
    if (es_principal) {
      await Direccion.update(
        { es_principal: false },
        { where: { id_cliente } }
      );
    }

    const nuevaDireccion = await Direccion.create({
      calle,
      numero,
      piso,
      departamento,
      ciudad,
      provincia,
      codigo_postal,
      pais,
      es_principal,
      id_cliente,
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    console.error("❌ Error al crear dirección:", error);
    res.status(500).json({ error: "Error al crear la dirección" });
  }
};

// Actualizar dirección
const updateDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      calle,
      numero,
      piso,
      departamento,
      ciudad,
      provincia,
      codigo_postal,
      pais,
      es_principal,
      id_cliente,
    } = req.body;

    const direccion = await Direccion.findByPk(id);

    if (!direccion) {
      return res.status(404).json({ error: "Dirección no encontrada" });
    }

    // Si se marca como principal, desmarcar otras del mismo cliente
    if (es_principal !== undefined && es_principal === true && id_cliente) {
      await Direccion.update(
        { es_principal: false },
        { where: { id_cliente, id: { [Op.ne]: id } } }
      );
    }

    // Actualizamos los campos
    if (calle !== undefined) direccion.calle = calle;
    if (numero !== undefined) direccion.numero = numero;
    if (piso !== undefined) direccion.piso = piso;
    if (departamento !== undefined) direccion.departamento = departamento;
    if (ciudad !== undefined) direccion.ciudad = ciudad;
    if (provincia !== undefined) direccion.provincia = provincia;
    if (codigo_postal !== undefined) direccion.codigo_postal = codigo_postal;
    if (pais !== undefined) direccion.pais = pais;
    if (es_principal !== undefined) direccion.es_principal = es_principal;
    if (id_cliente !== undefined) direccion.id_cliente = id_cliente;

    await direccion.save();

    res.json(direccion);
  } catch (error) {
    console.error("❌ Error al actualizar dirección:", error);
    res.status(500).json({ error: "Error al actualizar la dirección" });
  }
};

// Eliminar dirección
const deleteDireccion = async (req, res) => {
  try {
    const { id } = req.params;

    const direccion = await Direccion.findByPk(id);

    if (!direccion) {
      return res.status(404).json({ error: "Dirección no encontrada" });
    }

    // No eliminamos si es la única o la principal
    const totalDirecciones = await Direccion.count({
      where: { id_cliente: direccion.id_cliente },
    });

    if (totalDirecciones <= 1) {
      return res.status(400).json({
        error: "No puedes eliminar la única dirección asociada a un cliente",
      });
    }

    await direccion.destroy();

    res.json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar dirección:", error);
    res.status(500).json({ error: "Error al eliminar la dirección" });
  }
};

export {
  getAllDirecciones,
  getDireccionById,
  createDireccion,
  updateDireccion,
  deleteDireccion,
};