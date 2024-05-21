import BookingModel from "../model/booking.model.js";
import User from "../model/user.model.js";
import Room from "../model/room.model.js";
import { response } from "express";
import InvoiceModel from "../model/invoice.model.js";
import mongoose from "mongoose";

export const bookingsGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };
  const [total, bookings] = await Promise.all([
    BookingModel.countDocuments(query),
    BookingModel.find(query)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
  ]);
  res.status(200).json({
    total,
    bookings,
    page,
  });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  const booking = await BookingModel.findById(id);
  if (!booking) {
    return res.status(404).json({
      msg: "Reservation not found",
    });
  }

  res.status(200).json({
    booking,
  });
};

export const getBookingsByRoom = async (req, res) => {
  const { roomId } = req.params;
  const bookings = await BookingModel.find({
    room: roomId,
    tp_status: "ACTIVE",
  }).populate("user room");

  res.status(200).json({
    bookings,
  });
};

export const getBookingsByUser = async (req, res) => {
  const { userId } = req.params;
  const bookings = await BookingModel.find({
    user: userId,
    tp_status: "ACTIVE",
  }).populate({
    path: "room",
    populate: [
      {
        path: "images",
        model: "RoomImage",
      },
    ],
  });

  res.status(200).json({
    bookings,
  });
};

export const putBooking = async (req, res = response) => {
  const { id } = req.params;
  const { date_start, date_end } = req.body;

  const bookingToUpdate = {
    date_start,
    date_end,
    updated_at: new Date(),
  };

  const oldBooking = await BookingModel.findById(id).select(
    "date_start date_end",
  );

  if (!oldBooking) {
    return res.status(404).json({
      msg: "Reservation not found",
    });
  }

  if (
    new Date(date_end || oldBooking.date_end) <=
    new Date(date_start || oldBooking.date_start)
  ) {
    return res.status(400).json({
      msg: "End date must be greater than start date",
    });
  }

  Object.keys(bookingToUpdate).forEach((key) => {
    if (bookingToUpdate[key] === undefined) {
      delete bookingToUpdate[key];
    }
  });

  const updatedBooking = await BookingModel.findByIdAndUpdate(
    id,
    bookingToUpdate,
    { new: true },
  );

  res.status(200).json({
    msg: "Reservation successfully updated",
    booking: updatedBooking,
  });
};

export const bookingDelete = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    const booking = await BookingModel.findByIdAndUpdate(
      id,
      { tp_status: "INACTIVE" },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({
        msg: "Reservation not found",
      });
    }

    const [, , invoice] = await Promise.all([
      User.findByIdAndUpdate(
        booking.user,
        { $pullAll: { bookings: [booking._id] } },
        { new: true },
      ),
      Room.findByIdAndUpdate(
        booking.room,
        { $pullAll: { bookings: [booking._id] } },
        { new: true },
      ),
      InvoiceModel.findOneAndUpdate(
        { booking: booking._id },
        { tp_status: "INACTIVE" },
      ),
    ]);

    if (!invoice) {
      return res.status(404).json({
        msg: "Invoice not found",
      });
    }

    res.status(200).json({
      msg: "Reservation successfully deleted",
      booking,
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({
      msg: "Internal Server Error",
      error: e.message,
    });
    // NECESSARY TO USE FINALLY TO CLOSE THE SESSION
  } finally {
    session.endSession();
  }
};

export const bookingPost = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { date_start, date_end, room, user } = req.body;

    const booking = new BookingModel({
      date_start,
      date_end,
      room,
      user,
    });

    if (new Date(date_end) <= new Date(date_start)) {
      return res.status(400).json({
        msg: "End date must be greater than start date",
      });
    }

    const [, objRoom] = await Promise.all([
      User.findByIdAndUpdate(
        user,
        { $push: { bookings: booking._id } },
        { new: true },
      ),
      Room.findByIdAndUpdate(
        room,
        { $push: { bookings: booking._id } },
        { new: true },
      ),
    ]);

    booking.hotel = objRoom.hotel;

    const daysBooked = Math.ceil(
      (new Date(date_end) - new Date(date_start)) / (1000 * 60 * 60 * 24),
    );

    // create Invoice
    const invoice = new InvoiceModel({
      price: booking.room.price * daysBooked,
      booking_id: booking._id,
      user_id: user._id,
    });

    await invoice.save();

    await booking.save();

    await session.commitTransaction();

    res.status(201).json({
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
