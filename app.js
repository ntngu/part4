const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const config = require("./utils/config");
const errorHandler = require("./utils/error_handler");
const tokenHandler = require("./utils/token_handler");

mongoose.connect(config.MONGODB_URL);

app.use(cors());
app.use(express.json());
app.use(tokenHandler);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(errorHandler);

module.exports = app;
