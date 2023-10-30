import { routes } from "./routes.js";
import express from "express";

const app = express();

app.use("/api", routes);

export default app;
