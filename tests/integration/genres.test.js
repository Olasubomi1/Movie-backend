const request = require("supertest");
const { Genre } = require("../../models/genre");
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
});
