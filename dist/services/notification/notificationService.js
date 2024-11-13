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
exports.updateNotificationById = exports.getNotificationById = exports.getUserNotifications = void 0;
const Notification_1 = require("../../models/Notification");
const getUserNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notification_1.Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });
        if (notifications.length === 0) {
            const dummyData = [
                {
                    id: 1,
                    user_id: userId,
                    message: 'This is a dummy notification for testing purposes.',
                    created_at: '2024-08-14T00:00:00Z',
                    is_read: false,
                },
                {
                    id: 2,
                    user_id: userId,
                    message: 'Another dummy notification for testing purposes.',
                    created_at: '2024-08-15T00:00:00Z',
                    is_read: true,
                },
            ];
            return {
                status_code: 200,
                data: {
                    status: 'success',
                    message: 'No notifications found. Returning dummy data for testing purposes.',
                    data: dummyData,
                },
            };
        }
        return {
            status_code: 200,
            data: {
                status: 'success',
                message: 'Notifications retrieved successfully.',
                data: notifications,
            },
        };
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        return {
            status_code: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving notifications.',
            },
        };
    }
});
exports.getUserNotifications = getUserNotifications;
const getNotificationById = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield Notification_1.Notification.findOne({
            where: { id: notificationId, user_id: userId },
        });
        if (notification) {
            return {
                status: 'success',
                message: 'Notification retrieved successfully.',
                data: notification,
            };
        }
        else {
            // Dummy notification for testing purposes
            const dummyNotification = {
                id: 11,
                user_id: userId,
                message: 'This is a dummy notification for testing purposes.',
                created_at: '2024-08-14T00:00:00Z',
                is_read: false,
            };
            return {
                status: 'success',
                message: 'Notification not found. Returning dummy data for testing purposes.',
                data: dummyNotification,
            };
        }
    }
    catch (error) {
        return {
            status: 'failed',
            message: 'An error occurred while retrieving the notification.',
        };
    }
});
exports.getNotificationById = getNotificationById;
const updateNotificationById = (userId, notificationId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(notificationId, userId);
        const notification = yield Notification_1.Notification.findOne({
            where: { id: notificationId, user_id: userId },
        });
        console.log(notification);
        if (!notification) {
            return { status: 'failed', message: 'Notification not found.', data: {} };
        }
        yield notification.update(data);
        return {
            status: 'success',
            message: 'Notification updated successfully.',
            data: notification,
        };
    }
    catch (error) {
        return {
            status: 'success',
            message: 'Failed to updated notification',
            data: error.message,
        };
    }
});
exports.updateNotificationById = updateNotificationById;
