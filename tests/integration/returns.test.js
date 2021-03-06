const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
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
    server.close();
    await Rental.remove({});
  });
  it("should work!", async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBe(null);
  });
});
