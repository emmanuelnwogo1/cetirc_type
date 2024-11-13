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
exports.grantUserAccess = exports.getUserAccessInRoom = void 0;
const SmartLock_1 = require("../../../../models/SmartLock");
const User_1 = require("../../../../models/User");
const UserSmartLockAccess_1 = require("../../../../models/UserSmartLockAccess");
const getUserAccessInRoom = (roomId, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let accessList;
        if (roomId) {
            accessList = yield UserSmartLockAccess_1.UserSmartLockAccess.findAll({
                where: {
                    granted_by_id: user.id,
                    room_id: roomId,
                },
            });
        }
        else {
            accessList = yield UserSmartLockAccess_1.UserSmartLockAccess.findAll({
                where: {
                    granted_by_id: user.id,
                },
            });
        }
        if (!accessList || accessList.length == 0) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Access list not found.',
                    data: accessList,
                },
            };
        }
        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Access list retrieved successfully.',
                data: accessList,
            },
        };
    }
    catch (error) {
        console.error('Error retrieving user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving user access.',
            },
        };
    }
});
exports.getUserAccessInRoom = getUserAccessInRoom;
const grantUserAccess = (data, businessType, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, smart_lock_device_id, period } = data;
    try {
        const userToGrant = yield User_1.User.findOne({ where: { username } });
        const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id: smart_lock_device_id } });
        if (!userToGrant) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'User not found.',
                },
            };
        }
        if (!smartLock) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Smart lock not found.',
                },
            };
        }
        yield UserSmartLockAccess_1.UserSmartLockAccess.create({
            user_id: userToGrant.id,
            smart_lock_id: smartLock.id,
            granted_by_id: currentUser.id,
            period,
        });
        return {
            statusCode: 201,
            data: {
                status: 'success',
                message: 'Access granted successfully.',
            },
        };
    }
    catch (error) {
        console.error('Error granting user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while granting access.',
            },
        };
    }
});
exports.grantUserAccess = grantUserAccess;
