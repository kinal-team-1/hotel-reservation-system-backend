import FavoriteHotel from "../model/favoriteHoteles.model.js"; // Cambio de nombre de la importación
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

export const favoriteDelete = async (req, res) => {
  const { user, hotel } = req.body;

  const favorite = await FavoriteHotel.findOneAndDelete({
    user,
    hotel,
  });

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
  const { user, hotel } = req.body;

  const favorite = new FavoriteHotel({
    user,
    hotel,
  });

  await favorite.save();
  res.status(201).json({
    favorite,
  });
};
