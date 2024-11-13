"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const notificationController_1 = require("../controllers/notification/notificationController");
const router = express_1.default.Router();
router.get('/notifications', authMiddleware_1.default, notificationController_1.getNotificationsController);
router.get('/notifications/:id', authMiddleware_1.default, notificationController_1.getNotificationByIdController);
router.patch('/notifications/:id', authMiddleware_1.default, notificationController_1.updateNotificationByIdController);
exports.default = router;
