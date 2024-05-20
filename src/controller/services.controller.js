import Service from "../model/services.model.js";
import { response } from "express";

export const servicesGet = async (req, res = response) => {
  try {
    const { limit, page } = req.query;
    const query = { tp_status: "ACTIVE" };

    const [total, services] = await Promise.all([
      Service.countDocuments(query),
      Service.find(query)
        .skip(Number(page) * Number(limit))
        .limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      services,
      page,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        msg: "Service not found",
      });
    }

    res.status(200).json({
      service,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const putService = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, hotel_id } = req.body;

    const serviceToUpdate = {
      name,
      description,
      duration,
      price,
      hotel_id,
      updated_at: new Date(),
    };

    const updatedService = await Service.findByIdAndUpdate(
      id,
      serviceToUpdate,
      { new: true },
    );

    if (!updatedService) {
      return res.status(404).json({
        msg: "Service not found",
      });
    }

    res.status(200).json({
      msg: "Servicio updated successfully",
      service: updatedService,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Internal Server error",
    });
  }
};

export const serviceDelete = async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByIdAndUpdate(
    id,
    { tp_status: "INACTIVE" },
    { new: true },
  );

  if (!service) {
    return res.status(404).json({
      msg: "Service not found",
    });
  }

  res.status(200).json({
    msg: "Service deleted successfully",
    service,
  });
};

export const servicePost = async (req, res) => {
  const { name, description, duration, price, hotel_id } = req.body;
  const service = new Service({
    name,
    description,
    duration,
    price,
    hotel_id,
  });

  await service.save();
  res.status(201).json({
    service,
  });
};
