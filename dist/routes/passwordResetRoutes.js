"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passwordResetController_1 = require("../controllers/password/passwordResetController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.post('/password-reset/request/', authMiddleware_1.default, passwordResetController_1.requestPasswordResetController);
router.post('/password-reset/verify', passwordResetController_1.confirmPasswordReset);
exports.default = router;
