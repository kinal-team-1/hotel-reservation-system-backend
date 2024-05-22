import HotelImg from "../model/hotelImg.model.js";
import { response } from "express";

export const hotelImagesGet = async (req, res = response) => {
  try {
    const { hotel_id } = req.query;
    const images = await HotelImg.find({ ...(hotel_id ? { hotel_id } : null) });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error al obtener las imágenes del hotel:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getHotelImageById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const image = await HotelImg.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ image });
  } catch (error) {
    console.error("Error al obtener la imagen por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getHotelImageByHotel = async (req, res = response) => {
  try {
    const { hotelId } = req.params;
    const images = await HotelImg.find({ hotel_id: hotelId });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error al obtener la imagen por hotel ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const hotelImagesPost = async (req, res) => {
  try {
    const images = req.body.images;
    const savedImages = [];

    for (const image of images) {
      const newImage = new HotelImg({
        image_url: image.image_url,
        hotel_id: image.hotel_id,
        is_main_image: image.is_main_image,
      });

      const savedImage = await newImage.save();
      savedImages.push(savedImage);
    }

    res.status(201).json({ images: savedImages });
  } catch (error) {
    console.error("Error al crear las imágenes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const hotelImagePost = async (req, res) => {
  try {
    const { image_url, hotel_id, is_main_image } = req.body;
    const image = new HotelImg({ image_url, hotel_id, is_main_image });
    await image.save();
    res.status(201).json({ image });
  } catch (error) {
    console.error("Error al crear la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const changeMainImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_main_image, hotel_id } = req.body;

    await HotelImg.findOneAndUpdate(
      { hotel_id, is_main_image: true },
      { is_main_image: false },
    );

    const updatedImage = await HotelImg.findByIdAndUpdate(
      id,
      { is_main_image },
      { new: true },
    );
    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ updatedImage });
  } catch (error) {
    console.error("Error al actualizar la imagen:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const hotelImageDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await HotelImg.findByIdAndDelete(id);
    if (!deletedImage) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }
    res.status(200).json({ deletedImage });
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
