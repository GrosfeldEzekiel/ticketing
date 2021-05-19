"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
it("Successfully login", async () => {
    await supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    const response = await supertest_1.default(app_1.app)
        .post("/api/users/signin")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
});
it("Expect error of unexisting email", async () => {
    return supertest_1.default(app_1.app)
        .post("/api/users/signin")
        .send({
        email: "unexisting@test.com",
        password: "password",
    })
        .expect(400);
});
it("Expect error of incorrect password", async () => {
    await supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    return supertest_1.default(app_1.app)
        .post("/api/users/signin")
        .send({
        email: "test@test.com",
        password: "incorrect",
    })
        .expect(400);
});
