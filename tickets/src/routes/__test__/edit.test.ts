import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { getCookie } from "../../test/setup";

it("Expect error of ticket does not exists", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", getCookie())
    .send({ title: "My title", price: 20 })
    .expect(404);
});

it("Expect error of user not logged in", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({ title: "My title", price: 20 })
    .expect(401);
});

it("Expect error of user does not own the ticket", async () => {
  const initial = await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: "My ticket", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${initial.body.id}`)
    .set("Cookie", getCookie())
    .send({ title: "New Title", price: 30 })
    .expect(401);
});

it("Expect error of invalid params", async () => {
  const user = getCookie();
  const initial = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "My ticket", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${initial.body.id}`)
    .set("Cookie", user)
    .send({ title: "", price: 30 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${initial.body.id}`)
    .set("Cookie", user)
    .send({ title: "New Title", price: "-30" })
    .expect(400);
});

it("Should successfully update the ticket", async () => {
  const user = getCookie();
  const initial = await request(app)
    .post("/api/tickets")
    .set("Cookie", user)
    .send({ title: "My ticket", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${initial.body.id}`)
    .set("Cookie", user)
    .send({ title: "New Title", price: 30 })
    .expect(200);

  const response = await request(app)
    .get(`/api/tickets/${initial.body.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual("New Title");
  expect(response.body.price).toEqual(30);
});
