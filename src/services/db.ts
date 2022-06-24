import mongoose from "mongoose";

import config from "./config";

const { MONGO_URL } = config;

mongoose.connect(MONGO_URL);

mongoose.set("returnOriginal", false);
