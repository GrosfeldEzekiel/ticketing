"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const setup_1 = require("../../test/setup");
it("Should return the current user", async () => {
    const cookie = await setup_1.getCookie();
    const response = await supertest_1.default(app_1.app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .expect(200);
    expect(response.body.currentUser.email).toEqual("test@test.com");
});
it("Expect error of unauthorized", async () => {
    await supertest_1.default(app_1.app).get("/api/users/currentuser").expect(401);
});
