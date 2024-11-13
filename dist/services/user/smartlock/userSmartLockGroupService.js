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
exports.leaveSmartLockGroup = exports.getUserSmartLockGroups = void 0;
const SmartLock_1 = require("../../../models/SmartLock");
const UserSmartLockAccess_1 = require("../../../models/UserSmartLockAccess");
const getUserSmartLockGroups = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userAccessRecords = yield UserSmartLockAccess_1.UserSmartLockAccess.findAll({
        where: { user_id: userId },
    });
    const smartLockIds = userAccessRecords.map(access => access.smart_lock_id);
    if (smartLockIds.length === 0) {
        return {
            status: 'success',
            message: 'No smart locks found for the user.',
            data: [],
        };
    }
    const smartLocks = yield SmartLock_1.SmartLock.findAll({
        where: {
            id: smartLockIds,
        },
    });
    if (smartLocks.length > 0) {
        return {
            status: 'success',
            message: 'Smart locks associated with the user have been retrieved successfully.',
            data: smartLocks,
        };
    }
    else {
        return {
            status: 'success',
            message: 'No smart locks found for the user.',
            data: [],
        };
    }
});
exports.getUserSmartLockGroups = getUserSmartLockGroups;
const leaveSmartLockGroup = (userId, smartLockDeviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id: smartLockDeviceId } });
    if (!smartLock) {
        return {
            status: 'failed',
            message: 'Smart lock not found.',
            data: {}
        };
    }
    const userSmartLockAccess = yield UserSmartLockAccess_1.UserSmartLockAccess.findOne({
        where: { user_id: userId, smart_lock_id: smartLock.id }
    });
    if (!userSmartLockAccess) {
        return {
            status: 'failed',
            message: 'You are not associated with this smart lock group.',
            data: {}
        };
    }
    yield userSmartLockAccess.destroy();
    return {
        status: 'success',
        message: 'You have left the smart lock group successfully.',
        data: {}
    };
});
exports.leaveSmartLockGroup = leaveSmartLockGroup;
