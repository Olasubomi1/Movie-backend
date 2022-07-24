const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345678",
        phone: "1234567",
      },
      movie: {
        _id: movieId,
        title: "123456",
        dailyRentalRate: 5,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await Rental.remove({});
    await server.close();
  });

  it("should return 401 if client is not logged in!", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if no rental found for the customer/movie", async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    console.log(rental.dateReturned); // this should because dateReturned has a value but for one reason or the other its not.
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });
});
