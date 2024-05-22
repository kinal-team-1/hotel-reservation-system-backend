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

export const getUnavailableDates = async (req, res) => {
  const { userId } = req.params;
  const bookings = await BookingModel.find({
    user: userId,
    tp_status: "ACTIVE",
  });

  const mapBookingsByRoom = bookings.reduce((map, booking) => {
    map[booking.room] = map[booking.room] || [];
    map[booking.room].push(booking);

    return map;
  }, {});

  const result = Object.entries(mapBookingsByRoom).reduce(
    (map, [key, bookings]) => {
      const unavailableDates = bookings.map((booking) => {
        return {
          start: booking.date_start,
          end: booking.date_end,
        };
      });

      console.log({ unavailableDates, key });
      map[key] = unavailableDates;

      return map;
    },
    {},
  );

  res.status(200).json(result);
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

export const getBookingsByHotel = async (req, res) => {
  const { hotelId } = req.params;
  const bookings = await BookingModel.find({
    hotel: hotelId,
    tp_status: "ACTIVE",
  }).populate("user room hotel");

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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { date_start, date_end } = req.body;

    const bookingToUpdate = {
      date_start,
      date_end,
      updated_at: new Date(),
    };

    const oldBooking = await BookingModel.findById(id).select(
      "date_start date_end room",
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

    const bookingsInRange = await BookingModel.find({
      room: oldBooking.room,
      tp_status: "ACTIVE",
      _id: { $ne: id }, // Excluir la reserva que se está actualizando
      $or: [
        {
          // Caso 1: La fecha de inicio de la otra reserva está dentro del nuevo rango
          date_start: {
            $gte: new Date(date_start || oldBooking.date_start),
            $lte: new Date(date_end || oldBooking.date_end),
          },
        },
        {
          // Caso 2: La fecha de fin de la otra reserva está dentro del nuevo rango
          date_end: {
            $gte: new Date(date_start || oldBooking.date_start),
            $lte: new Date(date_end || oldBooking.date_end),
          },
        },
        {
          // Caso 3: El nuevo rango está completamente dentro de la otra reserva
          $and: [
            {
              date_start: {
                $lte: new Date(date_start || oldBooking.date_start),
              },
            },
            {
              date_end: {
                $gte: new Date(date_end || oldBooking.date_end),
              },
            },
          ],
        },
      ],
    });

    if (bookingsInRange.length > 0) {
      return res.status(400).json({
        msg: "There is already a booking in the same date range",
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

    await session.commitTransaction();

    res.status(200).json({
      msg: "Reservation successfully updated",
      booking: updatedBooking,
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({
      msg: "Internal Server Error",
      error: e.message,
    });
  } finally {
    session.endSession();
  }
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
        { booking_id: booking._id },
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
      price: objRoom.night_price * daysBooked,
      booking_id: booking._id,
      user_id: user,
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
