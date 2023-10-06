import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
const mongoose = require("mongoose");
//For env File
dotenv.config();
import connectToDB from "./db/db";
const app: Application = express();
const port = process.env.PORT || 8000;

import auth from "./routes/auth.routes";

connectToDB(process.env.DB_URL as string);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "SUCESS",
    response: "Welcome",
  });
});
app.use(express.json());
app.use("/api/v1/auth", auth);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
