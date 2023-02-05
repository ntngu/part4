const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", { url: 1, title: 1, author: 1 });
  res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  if (password.length < 3) {
    res.status(400).json({ error: "password length is too short" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    user.save((err) => {
      if (!err) {
        res.status(200).json(user);
      } else {
        next(err);
      }
    });
  }
});

module.exports = usersRouter;
