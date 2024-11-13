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
exports.getRoomDetails = void 0;
const Room_1 = require("../../models/Room");
const SmartLockGroup_1 = require("../../models/SmartLockGroup");
const getRoomDetails = (businessType, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { name: businessType } });
        if (!group) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'SmartLockGroup not found.',
                },
            };
        }
        console.log(roomId);
        const room = yield Room_1.Room.findOne({ where: { id: roomId, group_id: group.id } });
        if (!room) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Room not found.',
                },
            };
        }
        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Room details retrieved successfully.',
                data: room,
            },
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving room details.',
                data: {},
            },
        };
    }
});
exports.getRoomDetails = getRoomDetails;
