import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookie } from "../../test/setup";

it("Should have a router listening to api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("Expect unauthorized error", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("Should pass the request with authorization", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("Expect error of invalid title", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: "", price: "32" })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ price: "32" })
    .expect(400);
});

it("Expect error of invalid price", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: "My Title", price: "-20" })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: "My Title" })
    .expect(400);
});

it("Should successfully create ticket", async () => {
  // Add check to ensure that the ticket was added to the DB
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: "My ticket", price: 20 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});
