import HotelModel from "../model/hoteles.model.js";
import { response } from "express";

export const hotelsGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };

  const [total, hotels] = await Promise.all([
    HotelModel.countDocuments(query),
    HotelModel.find(query).skip(Number(page)).limit(Number(limit))
  ]);

  res.status(200).json({
    total,
    hotels
  });
};

export const getHotelById = async (req, res) => {
  const { id } = req.params;
  const hotel = await HotelModel.findById({ _id: id });
  if (!hotel) {
    return res.status(404).json({
      msg: "Room not found"
    });
  }

  res.status(200).json({
    hotel
  });
};

export const putHotel = async (req, res = response) => {
  const { id } = req.params;
  const { name, country, address, description } = req.body;

  const hotelToUpdate = {
    name,
    country,
    address,
    description,
    updated_at: new Date()
  };

  const updatedHotel = await HotelModel.findByIdAndUpdate(id, hotelToUpdate, {
    new: true
  });

  if (!updatedHotel) {
    return res.status(404).json({
      msg: "Room not found"
    });
  }

  res.status(200).json({
    msg: "Room updated successfully",
    hotel: updatedHotel
  });
};

export const hotelDelete = async (req, res) => {
  const { id } = req.params;

  const hotel = await HotelModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true }
  );

  if (!hotel) {
    return res.status(404).json({
      msg: "Hotel no encontrado"
    });
  }

  res.status(200).json({
    msg: "Hotel eliminado exitosamente",
    hotel
  });
};

export const hotelPost = async (req, res) => {
  const { name, country, address, description } = req.body;
  const hotel = new HotelModel({
    name,
    country,
    address,
    description,
    tp_status: "ACTIVE"
  });

  await hotel.save();
  res.status(201).json({
    hotel
  });
};
