import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let mongo: any;

jest.mock("../nats-wrapper");

beforeAll(async () => {
  process.env.JWT_KEY = "random";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const getCookie = () => {
  const sessionJSON = JSON.stringify({
    jwt: jwt.sign(
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
      },
      process.env.JWT_KEY!
    ),
  });
  // Return Cookie string
  return [`express:sess=${Buffer.from(sessionJSON).toString("base64")}`];
};
