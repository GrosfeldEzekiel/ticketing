"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordManager = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = util_1.promisify(crypto_1.scrypt);
class PasswordManager {
    static async toHash(password) {
        const salt = crypto_1.randomBytes(8).toString("hex");
        const buff = (await scryptAsync(password, salt, 64));
        return `${buff.toString("hex")}.${salt}`;
    }
    static async compare(storedPassword, suppliedPassword) {
        const [hashedPassword, salt] = storedPassword.split(".");
        const buff = (await scryptAsync(suppliedPassword, salt, 64));
        return buff.toString("hex") === hashedPassword;
    }
}
exports.PasswordManager = PasswordManager;
