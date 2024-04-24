import favUserHotel from "../model/favoriteHotel.model.js";
import { response } from "express";

export const favoritesGet = async (req, res = response) => {
  const { limite, desde } = req.query;
  const query = {};

  const [total, favorites] = await Promise.all([
    favUserHotel.countDocuments(query),
    favUserHotel.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    favorites,
  });
};

export const getFavoriteById = async (req, res) => {
  const { id } = req.params;
  const favorite = await favUserHotel.findById(id);
  if (!favorite) {
    return res.status(404).json({
      msg: "Favorito no encontrado",
    });
  }

  res.status(200).json({
    favorite,
  });
};

export const putFavorite = async (req, res = response) => {
  const { id } = req.params;
  // se puede agregar codigo para actulizar favorito si es necesario
};

export const favoriteDelete = async (req, res) => {
  const { id } = req.params;

  const favorite = await favUserHotel.findByIdAndDelete(id);

  if (!favorite) {
    return res.status(404).json({
      msg: "Favorito no encontrado",
    });
  }

  res.status(200).json({
    msg: "Favorito eliminado exitosamente",
    favorite,
  });
};

export const favoritePost = async (req, res) => {
  const { user_id, hotel_id } = req.body;

  const favorite = new favUserHotel({
    user_id,
    hotel_id,
  });

  await favorite.save();
  res.status(201).json({
    favorite,
  });
};
