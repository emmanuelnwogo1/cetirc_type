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
exports.addSmartLockToRoom = void 0;
const Room_1 = require("../../../models/Room");
const SmartLock_1 = require("../../../models/SmartLock");
const addSmartLockToRoom = (roomId, smartLockDeviceId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!smartLockDeviceId) {
        return {
            statusCode: 400,
            data: {
                status: 'failed',
                message: 'smart lock device id is required.',
                data: {}
            },
        };
    }
    try {
        const room = yield Room_1.Room.findByPk(roomId);
        if (!room) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Room not found.',
                    data: {}
                },
            };
        }
        const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id: smartLockDeviceId } });
        if (!smartLock) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Smart lock not found.',
                    data: {}
                },
            };
        }
        smartLock.room_id = roomId;
        yield smartLock.save();
        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Smart lock assigned to room successfully.',
                data: {}
            },
        };
    }
    catch (error) {
        console.error('Error assigning smart lock to room:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while assigning the smart lock to the room.',
                data: {}
            },
        };
    }
});
exports.addSmartLockToRoom = addSmartLockToRoom;
