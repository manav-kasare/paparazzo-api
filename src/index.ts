import "dotenv/config";
import express from "express";
import users from "./routes/users";
import follows from "./routes/follows";
import friends from "./routes/friends";
import config from "./services/config";
import "./services/db";

const { PORT } = config;
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Hi"));

app.use("/users", users);
app.use("/follows", follows);
app.use("/friends", friends);

app.listen(PORT, () => {
  console.log("server running on port:", PORT);
});
