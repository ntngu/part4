const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const blog = new Blog(req.body);
  if (blog.likes === undefined) {
    blog.likes = 0;
    const result = await blog.save();
    res.status(201).json(result);
  } else if (blog.title === undefined || blog.url === undefined) {
    res.status(400).json({ error: "title or url missing" });
  } else {
    const result = await blog.save();
    res.status(201).json(result);
  }
});

module.exports = blogsRouter;
