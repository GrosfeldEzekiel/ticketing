import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@eg-ticketing/common";
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";
import { cancelOrderRouter } from "./routes/patch";
import { newOrderRouter } from "./routes/new";

const app = express();
// TRUST NGINX
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "test" ? true : false,
  })
);

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(cancelOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
