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
exports.getNotificationByIdController = exports.updateNotificationByIdController = exports.getNotificationsController = void 0;
const notificationService_1 = require("../../services/notification/notificationService");
const getNotificationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, notificationService_1.getUserNotifications)(req.user.id);
    res.status(result.status_code).json(result.data);
});
exports.getNotificationsController = getNotificationsController;
const updateNotificationByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id, 10);
    try {
        const result = yield (0, notificationService_1.updateNotificationById)(userId, notificationId, req.body);
        res.status(200).json(result);
    }
    catch (e) {
        res.status(404).json({
            status: "failed",
            message: "Notification not found.",
            data: {}
        });
    }
});
exports.updateNotificationByIdController = updateNotificationByIdController;
const getNotificationByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id, 10);
    try {
        const result = yield (0, notificationService_1.getNotificationById)(notificationId, userId);
        res.status(200).json(result);
    }
    catch (e) {
        res.status(404).json({
            status: "failed",
            message: "Notification not found.",
            data: {}
        });
    }
});
exports.getNotificationByIdController = getNotificationByIdController;
