import Review from "../model/reviews.model.js";
import Hotel from "../model/hoteles.model.js";
import Booking from "../model/booking.model.js";
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

export const getReviewByHotelId = async (req, res) => {
  const { id } = req.params;
  const review = await Review.find({hotel_id: id});
  if (!review) {
    return res.status(404).json({
      msg: "Revisions not found",
    });
  }

  res.status(200).json({
    review,
  });
};

export const putReview = async (req, res = response) => {
  const { id } = req.params; // Extraemos el id de los parámetros de la solicitud
  const { comment, rating_cleanliness, rating_staff, rating_facilities } =
    req.body;

  const reviewToUpdate = {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    updated_at: new Date(),
  };

  Object.keys(reviewToUpdate).forEach((key) => {
    if (reviewToUpdate[key] === undefined) {
      delete reviewToUpdate[key];
    }
  });

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

export const reviewPost = async (req, res) => {
  const {
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    // user_id,
    hotel_id,
  } = req.body;

  const { _id } = req.loggedUser;

  const booking = await Booking.findOne({
    user: _id,
    hotel: hotel_id,
    tp_status: "ACTIVE",
  });

  const is_customer = Boolean(booking);

  const review = new Review({
    comment,
    rating_cleanliness,
    rating_staff,
    rating_facilities,
    user_id: _id,
    hotel_id,
    is_customer,
  });

  const newReview = await review.save();

  await Hotel.findByIdAndUpdate(
    hotel_id,
    { $push: { reviews: newReview._id } },
    { new: true },
  );

  res.status(201).json({
    review,
  });
};

export const reviewDelete = async (req, res) => {
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

  await Hotel.findByIdAndUpdate(
    review.hotel_id,
    { $pullAll: { reviews: [review._id] } },
    { new: true },
  );

  res.status(200).json({
    msg: "Review successfully deleted",
  });
};
