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
const BusinessProfile_1 = require("../../../models/BusinessProfile");
const BusinessSmartLock_1 = require("../../../models/BusinessSmartLock");
const SmartLock_1 = require("../../../models/SmartLock");
const SmartLockGroup_1 = require("../../../models/SmartLockGroup");
const UserSmartLockAccess_1 = require("../../../models/UserSmartLockAccess");
class UserSmartLockService {
    userSmartLockSignUp(deviceId, groupName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id: deviceId } });
            if (!smartLock) {
                throw new Error('Smart lock not found.');
            }
            var smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { name: groupName } });
            if (!smartLockGroup) {
                smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.create({
                    name: groupName,
                    description: `${groupName} Group`,
                });
            }
            if (smartLock.group_id !== smartLockGroup.id) {
                smartLock.group_id = smartLockGroup.id;
                yield smartLock.save();
            }
            const existingAccess = yield UserSmartLockAccess_1.UserSmartLockAccess.findOne({
                where: { user_id: userId, smart_lock_id: smartLock.id }
            });
            if (existingAccess) {
                return {
                    status: 'failed',
                    message: 'User already has access to this smart lock.',
                    data: {
                        device_id: deviceId,
                        group_name: groupName
                    }
                };
            }
            yield UserSmartLockAccess_1.UserSmartLockAccess.create({
                smart_lock_id: smartLock.id,
                user_id: userId,
                granted_at: new Date(),
                granted_by_id: userId,
                period: new Date(),
                room_id: smartLock.room_id
            });
            return {
                status: 'success',
                message: 'User successfully signed up for the smart lock.',
                data: {
                    device_id: deviceId,
                    group_name: groupName
                }
            };
        });
    }
    removeUserFromSmartLockGroup(userId, smartLockDeviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
            if (!businessProfile) {
                throw new Error('Business profile not found.');
            }
            const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id: smartLockDeviceId } });
            if (!smartLock) {
                throw new Error('Smart lock not found.');
            }
            const businessSmartLocks = yield BusinessSmartLock_1.BusinessSmartLock.findAll({ where: { business_profile_id: businessProfile.id } });
            const isSmartLockAssociated = businessSmartLocks.some((businessSmartLock) => businessSmartLock.smart_lock_id === smartLock.id);
            if (!isSmartLockAssociated) {
                throw new Error('Smart lock does not belong to your business.');
            }
            const userSmartLockAccess = yield UserSmartLockAccess_1.UserSmartLockAccess.findOne({ where: { user_id: userId, smart_lock_id: smartLock.id } });
            if (!userSmartLockAccess) {
                throw new Error('User is not associated with this smart lock group.');
            }
            yield userSmartLockAccess.destroy();
            return {
                status: 'success',
                message: 'User removed from smart lock group successfully.',
            };
        });
    }
}
exports.default = new UserSmartLockService();
