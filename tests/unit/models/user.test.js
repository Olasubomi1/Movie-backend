const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.getAuthToken", () => {
  it("should return a valid jwt", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

// validateUser = jest.fn().mockReturnValue({ _id: 1, isAdmin: false });
// let token = validateUser();
// console.log(token);
// expect(token).toEqual({ _id: 1, isAdmin: false });
