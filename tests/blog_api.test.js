const supertest = require("supertest");
const mongoose = require("mongoose");
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

describe("http get testing", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-type", /application\/json/);
  });
  test("blog ids are defined", async () => {
    const data = await Blog.findOne({});
    expect(data.id).toBeDefined();
  });
});

describe("http post testing", () => {
  test("http post works properly", async () => {
    const newBlog = {
      title: "test",
      author: "Dijkstra",
      url: "localhost",
      likes: "9000",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-type", /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogs.length + 1);
    const contents = blogsAtEnd.map((b) => b.title);
    expect(contents).toContain("test");
  });
  test("likes default to zero if missing", async () => {
    const newBlog = {
      title: "test",
      author: "Dijkstra",
      url: "localhost",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-type", /application\/json/);

    const getNewBlog = await Blog.findOne({ url: "localhost" });
    expect(getNewBlog.likes).toBe(0);
  });

  test("post is rejected if title or url are missing", async () => {
    const blog1 = {
      title: "test",
      author: "Dijkstra",
      likes: 1,
    };
    const blog2 = {
      author: "Dijkstra",
      url: "localhost",
      likes: 1,
    };
    await api.post("/api/blogs").send(blog1).expect(400);
    await api.post("/api/blogs").send(blog2).expect(400);
  });
});

describe("http delete testing", () => {
  test("deletes entry properly", async () => {
    const blog = await Blog.findOne({});
    await api.delete(`/api/blogs/${blog.id}`).send(blog).expect(200);
  });
});

describe("http put testing", () => {
  test("updates entry properly", async () => {
    let blog = await Blog.findOne({});
    blog = {
      title: "changed",
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
    };
    await api.put(`/api/blogs/${blog.id}`).send(blog).expect(200);

    const getUpdatedBlog = await Blog.findOne({ title: "changed" });
    console.log(getUpdatedBlog);
    expect(getUpdatedBlog.title).toBe("changed");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
