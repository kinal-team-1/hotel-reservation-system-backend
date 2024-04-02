import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hola, server funcionando");
});

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
