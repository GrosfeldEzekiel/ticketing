import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookie } from "../../test/setup";
import { OrderStatus } from "@eg-ticketing/common";
import { Order } from "../../models/order";

it("Successfully cancel an order", async () => {
  const ticket = Ticket.build({ title: "Concert", price: 20 });
  await ticket.save();

  const user = getCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const orderInDb = await Order.findById(order.id);

  expect(orderInDb!.status).toEqual(OrderStatus.Created);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("Should publish an order cancelled event");
