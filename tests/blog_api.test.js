const supertest = require("supertest");
const mongoose = require("mongoose");
const blogHelper = require("../utils/blog_helper");
const testHelper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/Blog");

const blogs = testHelper.initialBlogs;

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(blogs[0]);
  await blogObject.save();
  for (let i = 1; i < blogs.length; i++) {
    blogObject = new Blog(blogs[i]);
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-type", /application\/json/);
});


afterAll(async () => {
  await mongoose.connection.close();
});
