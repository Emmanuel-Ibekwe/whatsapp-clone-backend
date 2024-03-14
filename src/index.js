import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import { Server, Socket } from "socket.io";
import logger from "./configs/logger.js";
import SocketServer from "./SocketServer.js";

dotenv.config();

const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

console.log(process.env.NODE_ENV);

// mongoose.connection.on("error", err => {
//   logger.error(`Mongodb connection error: ${err}`);
//   process.exit(1);
// });

// Mongo debug mode

// if (process.env.NODE_ENV !== "production") {
//   // console.log("debug");
//   mongoose.set("debug", true);
// }

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    logger.info("Connected to Mongodb");
  })
  .catch(err => {
    logger.error(`Mongodb connection error: ${err}`);
    process.exit(1);
  });

let server;
server = app.listen(PORT, () => {
  logger.info(`Server is listening at ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ENDPOINT
  }
});

io.on("connection", socket => {
  logger.info("socket.io connected successfully.");
  SocketServer(socket, io);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = error => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
