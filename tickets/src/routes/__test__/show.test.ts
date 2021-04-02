import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { getCookie } from "../../test/setup";

it("Excpect error 404 not found", async () => {
  await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send()
    .expect(404);
});

it("Should return the ticket", async () => {
  const title = "My ticket";
  const price = "20";
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: title, price: price })
    .expect(201);

  const getResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(getResponse.body.title).toEqual(title);
  expect(getResponse.body.price).toEqual(+price);
});
