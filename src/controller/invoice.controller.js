import InvoiceModel from "../model/invoice.model.js";
import { response } from "express";

// Obtener todas las facturas
export const getInvoices = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };
  const [total, invoices] = await Promise.all([
    InvoiceModel.countDocuments(query),
    InvoiceModel.find(query)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
  ]);
  res.status(200).json({
    total,
    invoices,
  });
};

// Obtener una factura por su ID
export const getInvoiceById = async (req, res = response) => {
  const { id } = req.params;

  const invoice = await InvoiceModel.findById(id);
  if (!invoice) {
    return res.status(404).json({
      error: "Invoice not found",
    });
  }

  res.status(200).json({
    invoice,
  });
};

// Crear una nueva factura
export const createInvoice = async (req, res = response) => {
  const { id, price, booking, user } = req.body;

  try {
    const newInvoice = new InvoiceModel({
      id,
      price,
      booking,
      user,
    });
    await newInvoice.save();
    res.status(201).json({
      message: "Invoice created correctly",
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating invoice",
    });
  }
};

// Actualizar una factura por su ID
export const updateInvoice = async (req, res = response) => {
  const { id } = req.params;
  const { price, booking, user } = req.body;

  try {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      {
        price,
        booking,
        user,
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
      message: "Invoice updated correctly",
      invoice: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error updating invoice",
    });
  }
};

// Eliminar una factura por su ID
export const deleteInvoice = async (req, res = response) => {
  const { id } = req.params;

  const invoice = await InvoiceModel.findById(id);
  if (!invoice) {
    return res.status(404).json({
      error: "Invoice not found",
    });
  }

  const { tp_status } = req.body;
  if (tp_status) {
    return res.status(400).json({
      error: "tp_status cannot be passed in the request body",
    });
  }

  const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  res.status(200).json({
    message: "Invoice successfully updated",
    invoice: updatedInvoice,
  });
};
