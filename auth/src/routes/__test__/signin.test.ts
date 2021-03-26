import request from "supertest";
import { app } from "../../app";

it("Successfully login", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("Expect error of unexisting email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "unexisting@test.com",
      password: "password",
    })
    .expect(400);
});

it("Expect error of incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "incorrect",
    })
    .expect(400);
});
