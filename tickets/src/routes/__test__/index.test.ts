import request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/setup";

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", getCookie())
    .send({ title: "Random", price: "20" })
    .expect(201);
};

it("Should retrieve all tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
