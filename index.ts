import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "./src/routes/index"

dotenv.config();

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  PORT,
  MONGO_NAMEDB,
  PORTS,
} = process.env;
const DEFAULT_PORT = 3001;

const app = express();

mongoose
  .connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017/`, {})
  .then(() => {
    console.log("DB connection Successful");
  })
  .catch((err) => {
    console.error("DB connection Error:", err);
  });

app.use(cors());
app.use(cookieParser()); // Usa cookieParser para analizar las cookies

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  morgan("dev")(req, res, next);
});
app.use("/", routes); // Asegúrate de tener definido el router 'routes' correctamente.

const port = PORT ? parseInt(PORT) : DEFAULT_PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
