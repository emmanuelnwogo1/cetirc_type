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
exports.controlSmartLock = void 0;
const SmartLock_1 = require("../../../models/SmartLock");
const UserSmartLockAccess_1 = require("../../../models/UserSmartLockAccess");
const controlSmartLock = (userId, action, deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!['open', 'close'].includes(action)) {
        throw new Error('Invalid action.');
    }
    const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id: deviceId } });
    if (!smartLock) {
        throw new Error('Smart lock not found.');
    }
    const userAccess = yield UserSmartLockAccess_1.UserSmartLockAccess.findOne({
        where: { user_id: userId, smart_lock_id: smartLock.id },
    });
    if (!userAccess) {
        throw new Error('User does not have access to this smart lock.');
    }
    return {
        status: 'success',
        message: `Smart lock ${action} command sent successfully.`,
    };
});
exports.controlSmartLock = controlSmartLock;
