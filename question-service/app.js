import dotenv from "dotenv";
import { routes } from "./routes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

const uri = process.env.MONGO_DB_URL;

mongoose.connect(uri).then(() => {
  const app = express();
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.options("*", cors());
  app.use("/api", routes);

  app.listen(8000, () => {
    console.log("App Intialised on port 8000");
  });
});
