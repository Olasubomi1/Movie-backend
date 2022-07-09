const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
// always make sure to write and execute each test like its the only test. otherwise our test won't be repitable.
// and make sure to clean up the database afterwards
let server;
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ genre: "action" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      //   console.log(res.body[0]);
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("genre", genre.genre);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/6");
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ genre: "genre5" });

      //   console.log(res.status);
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre: "1234" });

      //   console.log(res.status);
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      const token = new User().generateAuthToken();

      const name = new Array(55).join("a");
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ genre: name });

      //   console.log(res.status);
      expect(res.status).toBe(400);
    });
  });
});
