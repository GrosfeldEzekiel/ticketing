"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const cookie_session_1 = __importDefault(require("cookie-session"));
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signout_1 = require("./routes/signout");
const signup_1 = require("./routes/signup");
const common_1 = require("@eg-ticketing/common");
const app = express_1.default();
exports.app = app;
// TRUST NGINX
app.set("trust proxy", true);
app.use(body_parser_1.json());
app.use(cookie_session_1.default({
    signed: false,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "test" ? true : false,
}));
app.use(current_user_1.currentUserRouter);
app.use(signin_1.signinRouter);
app.use(signout_1.signoutRouter);
app.use(signup_1.signupRouter);
app.all("*", () => {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
