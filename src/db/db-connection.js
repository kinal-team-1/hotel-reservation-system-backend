"use strict";

import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    mongoose.connection.on("error", () => {
      console.log("MongoDB | could not be connect to mongodb");
      mongoose.disconnect();
    });
    mongoose.connection.on("connecting", () => {
      console.log("MongoDB | Try connecting");
    });
    mongoose.connection.on("connected", () => {
      console.log("MongoDB | connected to mongoDB");
    });
    mongoose.connection.on("open", () => {
      console.log("MongoDB | connected to database");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB | reconnected to MongoDB");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB | disconnected");
    });

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });

    mongoose.set("debug", true);
  } catch (e) {
    console.log("Database connection failed", e);
  }
};
