import roomModel from "../model/room.model.js";
import { response } from "express";

export const roomsGet = async (req, res = response) => {
  const { limite, desde } = req.query;
  const query = { tp_status: "ACTIVE" };

  const [total, rooms] = await Promise.all([
    roomModel.countDocuments(query),
    roomModel.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    rooms,
  });
};

export const getRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await roomModel.findById({ _id: id });
  if (!room) {
    return res.status(404).json({
      msg: "Habitación no encontrada",
    });
  }

  res.status(200).json({
    room,
  });
};

export const putRoom = async (req, res = response) => {
  const { id } = req.params;
  const { description, people_capacity, night_price, tipo_habitacion } =
    req.body;

  const roomToUpdate = {
    description,
    people_capacity,
    night_price,
    tipo_habitacion,
    updated_at: new Date(),
  };

  const updatedRoom = await roomModel.findByIdAndUpdate(id, roomToUpdate, {
    new: true,
  });

  if (!updatedRoom) {
    return res.status(404).json({
      msg: "Habitación no encontrada",
    });
  }

  res.status(200).json({
    msg: "Habitación actualizada exitosamente",
    room: updatedRoom,
  });
};

export const roomDelete = async (req, res) => {
  const { id } = req.params;

  const room = await roomModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  if (!room) {
    return res.status(404).json({
      msg: "Habitación no encontrada",
    });
  }

  res.status(200).json({
    msg: "Habitación eliminada exitosamente",
    room,
  });
};

export const roomPost = async (req, res) => {
  const { description, people_capacity, night_price, tipo_habitacion } =
    req.body;
  const room = new roomModel({
    description,
    people_capacity,
    night_price,
    tipo_habitacion,
    tp_status: "ACTIVE",
  });

  await room.save();
  res.status(201).json({
    room,
  });
};
