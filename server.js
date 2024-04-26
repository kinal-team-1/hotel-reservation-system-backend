import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./src/db/db-connection.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import hotelRoutes from "./src/routes/hoteles.routes.js";
import hotelImgRoutes from "./src/routes/hotelImg.routes.js";
import serviceRoutes from "./src/routes/services.routes.js";
import invoiceRoutes from "./src/routes/invoice.routes.js";
import serviceAcquiredRoutes from "./src/routes/servicesAcquired.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hola, server funcionando");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/hotelImg", hotelImgRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/servicesAcquired", serviceAcquiredRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server up on port ${PORT}`);
  });
});
