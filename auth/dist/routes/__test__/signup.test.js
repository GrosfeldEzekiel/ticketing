"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
it("Should successfully create user", async () => {
    return supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
});
it("Successfully set session cookie", async () => {
    const response = await supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    expect(response.get("Set-Cookie")).toBeDefined();
});
it("Expect error of invalid email", async () => {
    return supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "invalid",
        passwortd: "password",
    })
        .expect(400);
});
it("Expect error of invalid password", async () => {
    return supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        passwortd: "p",
    })
        .expect(400);
});
it("Expect error of missing email and password", async () => {
    return supertest_1.default(app_1.app).post("/api/users/signup").send({}).expect(400);
});
it("Expect error of duplicated email", async () => {
    await supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(201);
    return supertest_1.default(app_1.app)
        .post("/api/users/signup")
        .send({
        email: "test@test.com",
        password: "password",
    })
        .expect(400);
});
