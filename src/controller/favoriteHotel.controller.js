import FavoriteHotel from "../model/favoriteHotel.model.js"; // Cambio de nombre de la importación
import { response } from "express";

export const favoritesGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const [total, favorites] = await Promise.all([
    FavoriteHotel.countDocuments(), // Cambio de nombre de la variable
    FavoriteHotel.find()
      .skip(page * limit)
      .limit(limit),
  ]);

  res.status(200).json({
    total,
    favorites,
  });
};

export const getFavoriteById = async (req, res) => {
  const { id } = req.params;
  const favorite = await FavoriteHotel.findById(id); // Cambio de nombre de la variable
  if (!favorite) {
    return res.status(404).json({
      msg: "Favorite not found",
    });
  }

  res.status(200).json({
    favorite,
  });
};

export const favoriteDelete = async (req, res) => {
  const { id } = req.params;

  const favorite = await FavoriteHotel.findByIdAndDelete(id); // Cambio de nombre de la variable

  if (!favorite) {
    return res.status(404).json({
      msg: "Favorite not found",
    });
  }

  res.status(200).json({
    msg: "Favorite deleted successfully",
    favorite,
  });
};

export const favoritePost = async (req, res) => {
  const { user_id, hotel_id } = req.body;

  const favorite = new FavoriteHotel({
    // Cambio de nombre de la variable
    user_id,
    hotel_id,
  });

  await favorite.save();
  res.status(201).json({
    favorite,
  });
};
