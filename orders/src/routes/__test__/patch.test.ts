import request from "supertest";
import mongoose from "mongoose"
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { getCookie } from "../../test/setup";
import { OrderStatus } from "@eg-ticketing/common";
import { Order } from "../../models/order";
import { natsWrapper } from "@eg-ticketing/common";

it("Successfully cancel an order", async () => {
  const ticket = Ticket.build({ title: "Concert", price: 20, id: mongoose.Types.ObjectId().toHexString() });
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

it("Should publish an order cancelled event", async () => {
  const ticket = Ticket.build({ id: mongoose.Types.ObjectId().toHexString(), title: "Concert", price: 20 });
  await ticket.save();

  const user = getCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
