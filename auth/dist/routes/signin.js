"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("@eg-ticketing/common");
const password_1 = require("../helpers/password");
const user_1 = require("../models/user");
const router = express_1.default.Router();
exports.signinRouter = router;
router.post("/api/users/signin", [
    express_validator_1.body("email").isEmail().withMessage("Email must be provided"),
    express_validator_1.body("password").trim().notEmpty().withMessage("Password must be provided"),
], common_1.validateRequest, async (req, res) => {
    const { email, password } = req.body;
    const user = await user_1.User.findOne({ email });
    if (!user)
        throw new common_1.BadRequestError("Invalid credentials");
    const validPassword = await password_1.PasswordManager.compare(user.password, password);
    if (!validPassword)
        throw new common_1.BadRequestError("Invalid credentials");
    // Generate JWT and store it on session object
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY);
    req.session = {
        jwt: userJwt,
    };
    res.status(200).send(user);
});
