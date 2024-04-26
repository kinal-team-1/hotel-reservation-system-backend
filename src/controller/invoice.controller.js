import invoiceModel from "../model/invoice.model.js";
import { validationResult } from "express-validator";
import { response } from "express";

// Obtener todas las facturas
export const getInvoices = async (req, res = response) => {
  try {
    const invoices = await invoiceModel.find();
    res.status(200).json({
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener las facturas",
    });
  }
};

// Obtener una factura por su ID
export const getInvoiceById = async (req, res = response) => {
  const { id } = req.params;

  try {
    const invoice = await invoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({
        error: "Factura no encontrada",
      });
    }
    res.status(200).json({
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener la factura",
    });
  }
};

// Crear una nueva factura
export const createInvoice = async (req, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { id, price, booking_id, user_id } = req.body;

  try {
    const newInvoice = new invoiceModel({
      id,
      price,
      tp_status: "ACTIVE",
      booking_id,
      user_id,
    });
    await newInvoice.save();
    res.status(201).json({
      message: "Factura creada correctamente",
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear la factura",
    });
  }
};

// Actualizar una factura por su ID
export const updateInvoice = async (req, res = response) => {
  const { id } = req.params;
  const { price, tp_status, booking_id, user_id } = req.body;

  try {
    const updatedInvoice = await invoiceModel.findByIdAndUpdate(
      id,
      {
        price,
        tp_status,
        booking_id,
        user_id,
        updated_at: new Date(),
      },
      { new: true },
    );
    if (!updatedInvoice) {
      return res.status(404).json({
        error: "Factura no encontrada",
      });
    }
    res.status(200).json({
      message: "Factura actualizada correctamente",
      invoice: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la factura",
    });
  }
};

// Eliminar una factura por su ID
export const deleteInvoice = async (req, res = response) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await invoiceModel.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({
        error: "Factura no encontrada",
      });
    }
    res.status(200).json({
      message: "Factura eliminada correctamente",
      invoice: deletedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar la factura",
    });
  }
};
