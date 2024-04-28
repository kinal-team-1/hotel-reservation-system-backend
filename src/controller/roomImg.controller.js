import roomImage from "../model/roomImg.model";
import { response } from "express";

export const roomImagesGet = async (req, res = response) => {
  try {
    const { room_id } = req.query;
    const images = await roomImage.find({ room_id });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error al obtener las imágenes de la habitación:", error);
    res.status(500).json({ message: "Error interno del Servidor" });
  }
};

export const getRoomImageById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const image = await roomImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ image });
  } catch (error) {
    console.error("Error al obtener la imagen por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const roomImagePost = async (req, res) => {
  try {
    const { image_url, room_id, is_main_image } = req.body;
    const image = new roomImage({ image_url, room_id, is_main_image });
    await image.save();
    res.status(201).json({ image });
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const putRoomImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, room_id, is_main_image } = req.body;
    const updatedImage = await roomImage.findByIdAndUpdate(
      id,
      { image_url, room_id, is_main_image },
      { new: true },
    );
    if (!updatedImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ updatedImage });
  } catch (error) {
    console.error("Error al actualizar la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const roomImageDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await roomImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ deletedImage });
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
