"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPin = exports.requestPasswordReset = void 0;
const sequelize_1 = require("sequelize");
const PasswordResetRequest_1 = require("../../models/PasswordResetRequest");
const User_1 = require("../../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { email } });
    if (!user) {
        return {
            status: 'failed',
            message: 'Email not found.',
            data: {}
        };
    }
    // Generate PIN
    const pin = Math.random().toString().slice(-6);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    yield PasswordResetRequest_1.PasswordResetRequest.create({
        user_id: user.id,
        pin: pin,
        expires_at: expiresAt,
        created_at: new Date()
    });
    // Send PIN via email
    //await sendMail(email, 'Password Reset PIN', `Your PIN for password reset is ${pin}. It expires in 10 minutes.`);
    return {
        status: 'success',
        message: 'PIN sent to your email.',
        data: {}
    };
});
exports.requestPasswordReset = requestPasswordReset;
const verifyPin = (email, pin, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    email = email.trim().toLowerCase();
    const user = yield User_1.User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email not found.');
    }
    const resetRequest = yield PasswordResetRequest_1.PasswordResetRequest.findOne({
        where: {
            user_id: user.id,
            pin,
            expires_at: { [sequelize_1.Op.gt]: new Date() }
        }
    });
    if (!resetRequest) {
        throw new Error('Invalid PIN or PIN has expired.');
    }
    if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters.');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield user.update({ password: hashedPassword });
    yield resetRequest.destroy();
    return {
        status: 'success',
        message: 'Password reset successfully.'
    };
});
exports.verifyPin = verifyPin;
