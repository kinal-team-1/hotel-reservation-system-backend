import bookingModel from "../model/booking.model.js";
import { response } from "express";

export const bookingsGet = async (req, res = response) => {
  const { limit, desde } = req.query;
  const query = { tp_status: "ACTIVE" };

  const [total, bookings] = await Promise.all([
    bookingModel.countDocuments(query),
    bookingModel.find(query).desde(Number(desde)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    bookings,
  });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  const booking = await bookingModel.findById(id);
  if (!booking) {
    return res.status(404).json({
      msg: "Reserva no encontrada",
    });
  }

  res.status(200).json({
    booking,
  });
};

export const putBooking = async (req, res = response) => {
  const { id } = req.params;
  const { date_start, date_end, tp_status } = req.body;

  const bookingToUpdate = {
    date_start,
    date_end,
    tp_status,
    updated_at: new Date(),
  };

  const updatedBooking = await bookingModel.findByIdAndUpdate(id, bookingToUpdate, {
    new: true,
  });

  if (!updatedBooking) {
    return res.status(404).json({
      msg: "Reserva no encontrada",
    });
  }

  res.status(200).json({
    msg: "Reserva actualizada exitosamente",
    booking: updatedBooking,
  });
};

export const bookingDelete = async (req, res) => {
  const { id } = req.params;

  const booking = await bookingModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  if (!booking) {
    return res.status(404).json({
      msg: "Reserva no encontrada",
    });
  }

  res.status(200).json({
    msg: "Reserva eliminada exitosamente",
    booking,
  });
};

export const bookingPost = async (req, res) => {
  const { date_start, date_end, tp_status } = req.body;
  const booking = new bookingModel({
    date_start,
    date_end,
    tp_status,
  });

  await booking.save();
  res.status(201).json({
    booking,
  });
};
