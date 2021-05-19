"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = void 0;
const supertest_1 = __importDefault(require("supertest"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const getCookie = async () => {
    const response = await supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    return response.get("Set-Cookie");
};
exports.getCookie = getCookie;
let mongo;
beforeAll(async () => {
    process.env.JWT_KEY = "random";
    mongo = new mongodb_memory_server_1.MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    await mongoose_1.default.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});
beforeEach(async () => {
    const collections = await mongoose_1.default.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
afterAll(async () => {
    await mongo.stop();
    await mongoose_1.default.connection.close();
});
