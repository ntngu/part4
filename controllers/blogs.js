const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res, next) => {
  const { title, author, url, likes } = req.body;
  const decodedToken = jwt.verify(req.token, config.SECRET);
  if (decodedToken.id === null) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user.id,
  });
  if (blog.likes === undefined) {
    blog.likes = 0;
  }
  blog.save((err) => {
    if (err) {
      next(err);
    }
  });
  user.blogs = user.blogs.concat(blog._id);
  await user.save();
  res.status(201).json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const result = await Blog.deleteOne(req.body);
  res.status(200).json(result);
});

blogsRouter.put("/:id", async (req, res) => {
  let oldBlog = await Blog.findById(req.body.id);
  oldBlog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };
  const result = await Blog.updateOne(oldBlog);
  res.status(200).json(result);
});

module.exports = blogsRouter;
