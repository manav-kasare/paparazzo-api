import "dotenv/config";
import express from "express";
import user from "./routes/user";
import follows from "./routes/follows";
import config from "./services/config";
import "./services/db";

const { PORT } = config;
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Hi"));

app.use("/user", user);
app.use("/follows", follows);

app.listen(PORT, () => {
  console.log("server running on port:", PORT);
});
