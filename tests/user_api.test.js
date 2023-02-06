const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const helper = require("./test_helper");

describe("one user in db", () => {
  test("creation fails with proper statuscode and message if username already exists in database", async () => {
    beforeEach(async () => {
      await User.deleteMany({});
      const passwordHash = await bcrypt.hash("secret", 10);
      const user = new User({ username: "root", passwordHash: passwordHash });

      await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "test",
        name: "test",
        password: "test",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(username).toContain(newUser.username);
    });
  });
});
