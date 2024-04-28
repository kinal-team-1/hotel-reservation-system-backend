import Review from "../model/review.model.js";
import { response } from "express";

export const reviewsGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };
  const [total, reviews] = await Promise.all([
    Review.countDocuments(query),
    Review.find(query)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
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
      msg: "Revision not found",
    });
  }

  res.status(200).json({
    review,
  });
};

export const putReview = async (req, res = response) => {
  const { id } = req.params; // Extraemos el id de los parámetros de la solicitud
  const {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    is_customer,
  } = req.body;

  const reviewToUpdate = {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    is_customer,
    updated_at: new Date(),
  };

  const updatedReview = await Review.findByIdAndUpdate(id, reviewToUpdate, {
    new: true,
  });

  if (!updatedReview) {
    return res.status(404).json({
      msg: "Revisión not found",
    });
  }

  res.status(200).json({
    msg: "Review successfully updated",
    review: updatedReview,
  });
};

export const reviewUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );
  if (!review) {
    return res.status(404).json({
      msg: "Review not found",
    });
  }

  res.status(200).json({
    msg: "Review status successfully updated",
    review,
  });
};

export const reviewPost = async (req, res) => {
  const {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    user_id,
    hotel_id,
    is_customer,
  } = req.body;

  const review = new Review({
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    user_id,
    hotel_id,
    is_customer,
  });

  await review.save();
  res.status(201).json({
    review,
  });
};
