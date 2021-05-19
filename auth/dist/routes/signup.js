"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const common_1 = require("@eg-ticketing/common");
const router = express_1.default.Router();
exports.signupRouter = router;
router.post("/api/users/signup", [
    express_validator_1.body("email").isEmail().withMessage("Email must be provided"),
    express_validator_1.body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
], common_1.validateRequest, async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await user_1.User.findOne({ email: email });
    if (existingUser) {
        throw new common_1.BadRequestError("Email alredy in use");
    }
    const user = user_1.User.build({ email: email, password: password });
    await user.save();
    // Generate JWT and store it on session object
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_KEY);
    req.session = {
        jwt: userJwt,
    };
    res.status(201).send(user);
});
