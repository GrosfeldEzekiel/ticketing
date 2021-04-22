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

it("Should successfully get all the user orders", async () => {
  const firstTicket = await buildTicket();
  const secondTicket = await buildTicket();
  const thirdTicket = await buildTicket();

  const firstUser = getCookie();
  const secondUser = getCookie();

  await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: secondTicket.id })
    .expect(201);

  const { body: secondOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: thirdTicket.id })
    .expect(201);

  const { body: orders } = await request(app)
    .get("/api/orders")
    .set("Cookie", secondUser)
    .expect(200);

  expect(orders.length).toEqual(2);
  expect(orders[0].id).toEqual(firstOrder.id);
  expect(orders[1].id).toEqual(secondOrder.id);
});
