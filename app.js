const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");

mongoose.connect(config.MONGODB_URL);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}.`);
});

module.exports = app;
