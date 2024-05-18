import { response } from "express";
import RoomModel from "../model/room.model.js";
import Review from "../model/reviews.model.js";
import RoomImage from '../model/roomImg.model.js';

export const roomsGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };

  const [total, rooms] = await Promise.all([
    RoomModel.countDocuments(query),
    RoomModel.find(query)
      .populate("hotel")
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    rooms,
  });
};


export const getFeed = async (req, res) => {
  const rooms = await RoomModel.find({ tp_status: 'ACTIVE' }).select('-tp_status');

  const hotels = [...new Set(rooms.map(room => room.hotel))];

  const hotelsWithRating = await Promise.allSettled(hotels.map(async (hotelId) => {
    const reviews = await Review.find({ hotel_id: hotelId }).select("rating_cleanliness rating_staff rating_facilities")
    const average = reviews.reduce((acc, { rating_cleanliness, rating_staff, rating_facilities }) => {
      return acc + rating_cleanliness + rating_staff + rating_facilities
    }, 0) / (reviews.length * 3)

    return {
      hotelId,
      average: average || 0,
      quantity_people_rated: reviews.length,
    }
  }));

  const hotelRatingsMap = hotelsWithRating.reduce((map, hotel) => {
    map[hotel.value.hotelId] = hotel.value;
    return map;
  }, {})

  const roomsWithRatingAndImgs = await Promise.allSettled(rooms.map(async (room) => {
    const [roomImage] = await RoomImage.find({ room_id: room._id, is_main_image: true }).select("image_url");

    return { 
      ...room.toObject(),
      rating: hotelRatingsMap[room.hotel].average,
      img: roomImage?.image_url || "",
      quantity_people_rated: hotelRatingsMap[room.hotel].quantity_people_rated,
    }
  }))

  res.status(200).json({
    total: rooms.length,
    rooms: roomsWithRatingAndImgs.map(({ value }) => value),
  })
}



export const getRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await RoomModel.findById({ _id: id }).populate('images hotel');
  if (!room) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    room,
  });
};


export const getRoomByHotelId = async (req, res) => {
  const { hotelId } = req.params;
  const rooms = await RoomModel.find({ hotel: hotelId }).populate('images');
  if (!rooms) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    rooms,
  });
};



export const putRoom = async (req, res = response) => {
  const { id } = req.params;
  const { description, people_capacity, night_price, room_type } = req.body;

  const roomToUpdate = {
    description,
    people_capacity,
    night_price,
    room_type,
    updated_at: new Date(),
  };

  Object.keys(roomToUpdate).forEach((key) => {
    if (roomToUpdate[key] === undefined) {
      delete roomToUpdate[key];
    }
  });

  const updatedRoom = await RoomModel.findByIdAndUpdate(id, roomToUpdate, {
    new: true,
  });

  if (!updatedRoom) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    msg: "Room updated successfully",
    room: updatedRoom,
  });
};

export const roomDelete = async (req, res) => {
  const { id } = req.params;

  const room = await RoomModel.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  if (!room) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    msg: "Room deleted successfully",
    room,
  });
};

export const roomPost = async (req, res) => {
  const { description, people_capacity, night_price, room_type, hotel } = req.body;
  const room = new RoomModel({
    description,
    people_capacity,
    night_price,
    room_type,
    hotel,
  });

  await room.save();
  res.status(201).json({
    room,
  });
};
