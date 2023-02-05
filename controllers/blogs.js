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
})

module.exports = blogsRouter;
