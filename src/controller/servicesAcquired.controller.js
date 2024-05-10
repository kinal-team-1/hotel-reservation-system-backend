import { validationResult } from "express-validator";
import { response } from "express";
import ServicesAcquiredModel from "../model/servicesAcquired.model.js";

// Obtener todos los servicios adquiridos
export const getServicesAcquired = async (req, res = response) => {
  try {
    const totalServicesAcquired = await ServicesAcquiredModel.countDocuments();
    const servicesAcquired = await ServicesAcquiredModel.find();

    res.status(200).json({
      total: totalServicesAcquired,
      servicesAcquired,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error when obtaining the purchased services",
    });
  }
};

// Obtener un servicio adquirido por un ID de hotel
export const getServicesByHotelID = async (req, res = response) => {
  const { hotel } = req.params;

  try {
    const servicesAcquired = await ServicesAcquiredModel.find({ hotel });
    if (!servicesAcquired || servicesAcquired.length === 0) {
      return res.status(404).json({
        error: "No services purchased for this hotel were found",
      });
    }
    res.status(200).json({
      servicesAcquired,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error when obtaining the purchased services",
    });
  }
};

// Crear un nuevo servicio adquirido
export const createServicesAcquired = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    transaction,
    services,
    quantity,
    date_acquired,
    date_start,
    date_end,
    total_price,
  } = req.body;

  try {
    const newServiceAcquired = new ServicesAcquiredModel({
      transaction,
      services,
      quantity,
      date_acquired,
      date_start,
      date_end,
      total_price,
    });
    await newServiceAcquired.save();
    res.status(201).json({
      message: "Servicio adquirido creado correctamente",
      serviceAcquired: newServiceAcquired,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear el servicio adquirido",
    });
  }
};

// Actualizar un servicio adquirido por su ID
export const updateServicesAcquired = async (req, res = response) => {
  const { id } = req.params;
  const {
    transaction,
    services,
    quantity,
    date_acquired,
    date_start,
    date_end,
    total_price,
  } = req.body;

  try {
    const updatedServiceAcquired =
      await ServicesAcquiredModel.findByIdAndUpdate(
        id,
        {
          transaction,
          services,
          quantity,
          date_acquired,
          date_start,
          date_end,
          total_price,
          updated_at: new Date(),
        },
        { new: true },
      );
    if (!updatedServiceAcquired) {
      return res.status(404).json({
        error: "Servicio adquirido no encontrado",
      });
    }
    res.status(200).json({
      message: "Servicio adquirido actualizado correctamente",
      serviceAcquired: updatedServiceAcquired,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el servicio adquirido",
    });
  }
};

// Eliminar un servicio adquirido por su ID
export const deleteServicesAcquired = async (req, res = response) => {
  const { id } = req.params;

  try {
    const deletedServiceAcquired =
      await ServicesAcquiredModel.findByIdAndDelete(id);
    if (!deletedServiceAcquired) {
      return res.status(404).json({
        error: "Servicio adquirido no encontrado",
      });
    }
    res.status(200).json({
      message: "Servicio adquirido eliminado correctamente",
      serviceAcquired: deletedServiceAcquired,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el servicio adquirido",
    });
  }
};
