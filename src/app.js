import express from "express";
import morgan from "morgan";
import helmet from "helmet";
// import bodyParser from "body-parser";
import expressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import expressFileUpload from "express-fileupload";
import cors from "cors";

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

app.use();

app.get("/", (req, res) => {
  res.send("Hello from the server.");
});

app.post("/", (req, res) => {
  res.send(req.body);
});

export default app;
