import favUserHotel from "../model/favoriteHotel.model.js";
import { response } from "express";

export const favoritesGet = async (req, res = response) => {
  const { limite, page } = req.query;
  const [total, favorites] = await Promise.all([
    favUserHotel.countDocuments(),
    favUserHotel.find().skip(page * limit).limit(limite),
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
      msg: "Favorite not found",
    });
  }

  res.status(200).json({
    favorite,
  });
};

export const favoriteDelete = async (req, res) => {
  const { id } = req.params;

  const favorite = await favUserHotel.findByIdAndDelete(id);

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

  const favorite = new favUserHotel({
    user_id,
    hotel_id,
  });

  await favorite.save();
  res.status(201).json({
    favorite,
  });
};
