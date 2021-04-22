import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookie } from "../../test/setup";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it("Expect unauthorized error", async () => {
  const ticket = await buildTicket();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId: ticket.id });

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", getCookie())
    .expect(401);
});

it("Expect not found error", async () => {
  const ticket = await buildTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId: ticket.id });

  await request(app)
    .get(`/api/orders/${mongoose.Types.ObjectId()}`)
    .set("Cookie", getCookie())
    .expect(404);
});

it("Should successfully get order", async () => {
  const ticket = await buildTicket();

  const user = getCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
