import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

console.log(process.env.NODE_ENV);
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
