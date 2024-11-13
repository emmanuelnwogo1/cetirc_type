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
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPasswordReset = exports.requestPasswordResetController = void 0;
const passwordResetService_1 = require("../../services/password/passwordResetService");
const requestPasswordResetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const result = yield (0, passwordResetService_1.requestPasswordReset)(email);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred while processing your request.',
            data: {}
        });
    }
});
exports.requestPasswordResetController = requestPasswordResetController;
const confirmPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pin, new_password, confirm_password } = req.body;
    if (new_password !== confirm_password) {
        res.status(400).json({
            status: 'failed',
            message: 'Passwords do not match.',
            data: {}
        });
    }
    try {
        const result = yield (0, passwordResetService_1.verifyPin)(email, pin, new_password);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
});
exports.confirmPasswordReset = confirmPasswordReset;
