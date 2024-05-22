import { response } from "express";
import RoomModel from "../model/room.model.js";
import Review from "../model/reviews.model.js";
import RoomImage from "../model/roomImg.model.js";
import FavoriteHotels from "../model/favoriteHoteles.model.js";
import BookingModel from "../model/booking.model.js";

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
  const user = req.loggedUser._id;
  const rooms = await RoomModel.find({ tp_status: "ACTIVE" }).select(
    "-tp_status",
  );
  const favs = await FavoriteHotels.find({ user });
  const favHotels = new Set(favs.map(({ hotel }) => hotel.toString()));

  const hotels = [...new Set(rooms.map((room) => room.hotel.toString()))];

  const hotelsWithRating = await Promise.allSettled(
    hotels.map(async (hotelId) => {
      const reviews = await Review.find({ hotel_id: hotelId }).select(
        "rating_cleanliness rating_staff rating_facilities",
      );
      const average =
        reviews.reduce(
          (acc, { rating_cleanliness, rating_staff, rating_facilities }) => {
            return acc + rating_cleanliness + rating_staff + rating_facilities;
          },
          0,
        ) /
        (reviews.length * 3);

      return {
        hotelId,
        average: average || 0,
        quantity_people_rated: reviews.length,
        fav: favHotels.has(hotelId),
      };
    }),
  );

  const hotelRatingsMap = hotelsWithRating.reduce((map, hotel) => {
    map[hotel.value.hotelId] = hotel.value;
    return map;
  }, {});

  const roomsWithRatingAndImgs = await Promise.allSettled(
    rooms.map(async (room) => {
      const [roomImage] = await RoomImage.find({
        room_id: room._id,
        is_main_image: true,
      }).select("image_url");

      const hotel = hotelRatingsMap[room.hotel];

      return {
        ...room.toObject(),
        rating: hotel.average,
        img: roomImage?.image_url || "",
        quantity_people_rated: hotel.quantity_people_rated,
        favorite: hotel.fav,
      };
    }),
  );

  res.status(200).json({
    total: rooms.length,
    rooms: roomsWithRatingAndImgs.map(({ value }) => value),
  });
};

export const getRoomById = async (req, res) => {
  const { id } = req.params;
  const room = await RoomModel.findById({ _id: id }).populate(
    "images hotel bookings",
  );
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
  const rooms = await RoomModel.find({ hotel: hotelId }).populate("images");
  if (!rooms) {
    return res.status(404).json({
      msg: "Room not found",
    });
  }

  res.status(200).json({
    rooms,
  });
};

export const getRoomsStats = async (req, res) => {
  const { hotelId } = req.params;

  // Find all bookings for the given hotel
  const bookings = await BookingModel.find({
    hotel: hotelId,
    tp_status: "ACTIVE",
  });

  // Group bookings by room and count the number of bookings for each room
  const bookingCounts = bookings.reduce((counts, booking) => {
    counts[booking.room] = (counts[booking.room] || 0) + 1;
    return counts;
  }, {});

  // Find all rooms for the given hotel
  const rooms = await RoomModel.find({ hotel: hotelId });

  // Combine room data with booking count data
  const roomsWithBookingCounts = rooms.map((room) => ({
    ...room._doc,
    bookingCount: bookingCounts[room._id] || 0,
  }));

  res.status(200).json(roomsWithBookingCounts);
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
  const { description, people_capacity, night_price, room_type, hotel } =
    req.body;
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
