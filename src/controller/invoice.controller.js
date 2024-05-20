import Invoice from "../model/invoice.model.js";
import { response } from "express";

// Obtener todas las facturas
export const getInvoices = async (req, res = response) => {
  try {
    const { limit, page } = req.query;
    const query = { tp_status: "ACTIVE" };
    const [total, invoices] = await Promise.all([
      Invoice.countDocuments(query),
      Invoice.find(query)
        .skip(Number(page) * Number(limit))
        .limit(Number(limit)),
    ]);
    res.status(200).json({
      total,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Obtener una factura por su ID
export const getInvoiceById = async (req, res = response) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        error: "Invoice not found",
      });
    }
    res.status(200).json({
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Crear una nueva factura
export const createInvoice = async (req, res = response) => {
  const { price, booking_id, user_id } = req.body;

  try {
    const newInvoice = new Invoice({
      price,
      booking_id,
      user_id,
    });
    await newInvoice.save();
    res.status(201).json({
      message: "Invoice created sucessfully",
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Actualizar una factura por su ID
export const updateInvoice = async (req, res = response) => {
  const { id } = req.params;
  const { price, booking_id, user_id } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        price,
        booking_id,
        user_id,
        updated_at: new Date(),
      },
      { new: true },
    );
    if (!updatedInvoice) {
      return res.status(404).json({
        error: "Invoice not found",
      });
    }
    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Eliminar una factura por su ID
export const deleteInvoice = async (req, res = response) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await Invoice.findByIdAndUpdate(id, {
      tp_status: "INACTIVE",
    });
    if (!deletedInvoice) {
      return res.status(404).json({
        error: "Invoice not found",
      });
    }
    res.status(200).json({
      message: "Invoice deleted successfully",
      invoice: deletedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar la factura",
    });
  }
};
