import request from "supertest";
import { app } from "../../app";
import { getCookie } from "../../test/setup";

it("Should return the current user", async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Expect error of unauthorized", async () => {
  await request(app).get("/api/users/currentuser").expect(401);
});
