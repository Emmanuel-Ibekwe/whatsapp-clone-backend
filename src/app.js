import express from "express";
import morgan from "morgan";
import helmet from "helmet";
// import bodyParser from "body-parser";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import expressFileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";

const app = express();

// Morgan: for http request logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Helmet: for secure express apps by setting various http headers
app.use(helmet());

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(expressMongoSanitize());
// app.use(bodyParser.json());

app.use(cookieParser());

app.use(compression());

app.use(expressFileUpload({ useTempFiles: true }));

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

app.use("/api/v1", routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});

app.use(async (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

export default app;
