import serviceModel from "../model/services.model.js";
import { response } from "express";

export const servicesGet = async (req, res = response) => {
  const { limit, page } = req.query;
  const query = { tp_status: "ACTIVE" };

  const [total, services] = await Promise.all([
    serviceModel.countDocuments(query),
    serviceModel
      .find(query)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    services,
  });
};

export const getServiceById = async (req, res) => {
  const { id } = req.params;
  const service = await serviceModel.findById({ _id: id });
  if (!service) {
    return res.status(404).json({
      msg: "Service not found",
    });
  }

  res.status(200).json({
    service,
  });
};

export const putService = async (req, res = response) => {
  const { id } = req.params;
  const { name, description, duration, price, hotel } = req.body;

  const serviceToUpdate = {
    name,
    description,
    duration,
    price,
    hotel,
    updated_at: new Date(),
  };

  const updatedService = await serviceModel.findByIdAndUpdate(
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
    msg: "Servicio actualizado exitosamente",
    service: updatedService,
  });
};

export const serviceDelete = async (req, res) => {
  const { id } = req.params;

  const service = await serviceModel.findByIdAndUpdate(
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
    msg: "Service successfully removed",
    service,
  });
};

export const servicePost = async (req, res) => {
  const { name, description, duration, price, hotel } = req.body;
  const service = new serviceModel({
    name,
    description,
    duration,
    price,
    hotel,
  });

  await service.save();
  res.status(201).json({
    service,
  });
};
