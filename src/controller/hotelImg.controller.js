import hotelImage from "../model/hotelImg.model";
import { response } from "express";

export const hotelImagesGet = async (req, res = response) => {
  try {
    const { hotel_id } = req.query;
    const images = await hotelImage.find({ hotel_id });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error al obtener las imágenes del hotel:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getHotelImageById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const image = await hotelImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ image });
  } catch (error) {
    console.error("Error al obtener la imagen por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const hotelImagePost = async (req, res) => {
  try {
    const { image_url, hotel_id, is_main_image } = req.body;
    const image = new hotelImage({ image_url, hotel_id, is_main_image });
    await image.save();
    res.status(201).json({ image });
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const putHotelImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, hotel_id, is_main_image } = req.body;
    const updatedImage = await hotelImage.findByIdAndUpdate(
      id,
      { image_url, hotel_id, is_main_image },
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

export const hotelImageDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await hotelImage.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ deletedImage });
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
