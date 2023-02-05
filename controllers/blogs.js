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
  const user = req.user;
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
  const { id } = req.body;
  const user = req.user;
  const blog = await Blog.findById(id);
  if (blog.user.toString() !== user.id.toString()) {
    return res.status(400).json({ error: "not authorized" });
  }
  const result = await Blog.deleteOne(req.body);
  res.status(200).json(result);
});

blogsRouter.put("/:id", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const user = req.user;
  let oldBlog = await Blog.findById(req.body.id);

  if (oldBlog.user.toString() !== user.id.toString()) {
    return res.status(400).json({ error: "not authorized" });
  }

  oldBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes,
  };
  const result = await Blog.updateOne(oldBlog);
  res.status(200).json(result);
});

module.exports = blogsRouter;
