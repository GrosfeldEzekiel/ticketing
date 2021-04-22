import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { getCookie } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@eg-ticketing/common";

it("Expect bad ticket Id", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId: "123" })
    .expect(400);
});

it("Expect error if ticket does not exists", async () => {
  const id = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({ ticketId: id })
    .expect(404);
});

it("Expect error if ticket is reserved", async () => {
  const ticket = Ticket.build({ title: "Concert", price: 20 });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "randomId",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("Should successfully reserve a ticket", async () => {
  const ticket = Ticket.build({ title: "Concert", price: 20 });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
});

it.todo("Should successfully emit an event");
