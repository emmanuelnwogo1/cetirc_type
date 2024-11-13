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
exports.getRoomsListByBusinessType = void 0;
const Room_1 = require("../../models/Room");
const SmartLockGroup_1 = require("../../models/SmartLockGroup");
const getRoomsListByBusinessType = (businessType) => __awaiter(void 0, void 0, void 0, function* () {
    const validBusinessTypes = SmartLockGroup_1.SmartLockGroup.BUSINESS_TYPES;
    if (!validBusinessTypes.includes(businessType)) {
        return {
            statusCode: 400,
            data: {
                status: 'failed',
                message: 'Invalid business type. Please provide a valid business type.',
            },
        };
    }
    try {
        const group = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { name: businessType } });
        if (!group) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'SmartLockGroup not found. Please provide a valid business type.',
                },
            };
        }
        const rooms = yield Room_1.Room.findAll({ where: { group_id: group.id } });
        if (!rooms.length) {
            return {
                statusCode: 200,
                data: {
                    status: 'success',
                    message: 'No rooms found for the specified business type.',
                    data: [],
                },
            };
        }
        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Rooms retrieved successfully.',
                data: rooms,
            },
        };
    }
    catch (error) {
        console.error('Error retrieving rooms:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving rooms.',
                data: {},
            },
        };
    }
});
exports.getRoomsListByBusinessType = getRoomsListByBusinessType;
