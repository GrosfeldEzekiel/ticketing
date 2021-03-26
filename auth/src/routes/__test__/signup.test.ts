import request from "supertest";
import { app } from "../../app";

it("Should successfully create user", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("Successfully set session cookie", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("Expect error of invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "invalid",
      passwortd: "password",
    })
    .expect(400);
});

it("Expect error of invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      passwortd: "p",
    })
    .expect(400);
});

it("Expect error of missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("Expect error of duplicated email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});
