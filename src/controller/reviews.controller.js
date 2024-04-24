import Review from "../model/review.model.js";
import { response } from "express";

export const reviewsGet = async (req, res = response) => {
  const { limite, desde } = req.query;
  const query = {};

  const [total, reviews] = await Promise.all([
    Review.countDocuments(query),
    Review.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.status(200).json({
    total,
    reviews,
  });
};

export const getReviewById = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({
      msg: "Revisión no encontrada",
    });
  }

  res.status(200).json({
    review,
  });
};

export const putReview = async (req, res = response) => {
  const { id } = req.params;
  const {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    tp_status,
    is_custom,
    user_id,
    hotel_id,
  } = req.body;

  const reviewToUpdate = {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    tp_status,
    is_custom,
    user_id,
    hotel_id,
    updated_at: new Date(),
  };

  const updatedReview = await Review.findByIdAndUpdate(id, reviewToUpdate, {
    new: true,
  });

  if (!updatedReview) {
    return res.status(404).json({
      msg: "Revisión no encontrada",
    });
  }

  res.status(200).json({
    msg: "Revisión actualizada exitosamente",
    review: updatedReview,
  });
};

export const reviewDelete = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return res.status(404).json({
      msg: "Revisión no encontrada",
    });
  }

  res.status(200).json({
    msg: "Revisión eliminada exitosamente",
    review,
  });
};

export const reviewPost = async (req, res) => {
  const {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    tp_status,
    is_custom,
    user_id,
    hotel_id,
  } = req.body;

  const review = new Review({
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    tp_status,
    is_custom,
    user_id,
    hotel_id,
  });

  await review.save();
  res.status(201).json({
    review,
  });
};
