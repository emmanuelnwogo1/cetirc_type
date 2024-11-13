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
exports.addSmartLockService = exports.grantSmartLockAccessToBusiness = exports.getBusinessSmartLocks = exports.signUpBusinessSmartLock = void 0;
const sequelize_1 = require("sequelize");
const BusinessProfile_1 = require("../../models/BusinessProfile");
const BusinessSmartLock_1 = require("../../models/BusinessSmartLock");
const SmartLock_1 = require("../../models/SmartLock");
const SmartLockGroup_1 = require("../../models/SmartLockGroup");
const User_1 = require("../../models/User");
const UserSmartLockAccess_1 = require("../../models/UserSmartLockAccess");
const Room_1 = require("../../models/Room");
const signUpBusinessSmartLock = (userId, smartLockId, businessType) => __awaiter(void 0, void 0, void 0, function* () {
    const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
    if (!businessProfile) {
        throw new Error('Business profile not found.');
    }
    const smartLock = yield SmartLock_1.SmartLock.findByPk(smartLockId);
    if (!smartLock) {
        throw new Error(`Smart lock with ID ${smartLockId} does not exist.`);
    }
    let smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { name: businessType } });
    if (!smartLockGroup) {
        smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.create({ name: businessType });
    }
    const [businessSmartLock, created] = yield BusinessSmartLock_1.BusinessSmartLock.upsert({
        business_profile_id: businessProfile.id,
        smart_lock_id: smartLock.id,
        business_type_id: smartLockGroup.id,
    });
    return {
        status: 'success',
        message: 'Smart lock signed up successfully for the business.',
        data: { businessSmartLock, created },
    };
});
exports.signUpBusinessSmartLock = signUpBusinessSmartLock;
const getBusinessSmartLocks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
    if (!businessProfile) {
        return {
            status: 'failed',
            message: 'Business profile not found. Please ensure you have a valid business profile associated with your account.',
            data: []
        };
    }
    const businessSmartLocks = yield BusinessSmartLock_1.BusinessSmartLock.findAll({
        where: { business_profile_id: businessProfile.id },
    });
    const businessSmartLockIds = businessSmartLocks.map(bsl => bsl.smart_lock_id);
    const smartLocks = yield SmartLock_1.SmartLock.findAll({
        where: { id: { [sequelize_1.Op.in]: businessSmartLockIds } }
    });
    if (smartLocks.length === 0) {
        return {
            status: 'success',
            message: 'No smart locks found for this business profile.',
            data: []
        };
    }
    return {
        status: 'success',
        message: 'Smart locks retrieved successfully.',
        data: smartLocks
    };
});
exports.getBusinessSmartLocks = getBusinessSmartLocks;
const grantSmartLockAccessToBusiness = (requestUser, username, device_id, period, room_id, businessType, grantedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const validBusinessTypes = [
        'apartment',
        'school',
        'gym',
        'hotel',
        'retail_store',
        'company',
        'airbnb',
        'others'
    ];
    if (!validBusinessTypes.includes(businessType)) {
        return {
            status: 'failed',
            message: 'Invalid business type.',
            data: {}
        };
    }
    const userToGrant = yield User_1.User.findOne({ where: { username } });
    if (!userToGrant) {
        return {
            status: 'failed',
            message: 'User not found.',
            data: {}
        };
    }
    const smartLock = yield SmartLock_1.SmartLock.findOne({ where: { device_id } });
    if (!smartLock) {
        return {
            status: 'failed',
            message: 'Smart lock not found.',
            data: {}
        };
    }
    const room = yield Room_1.Room.findOne({ where: { id: room_id } });
    if (!room) {
        return {
            status: 'failed',
            message: 'Room not found.',
            data: {}
        };
    }
    const smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { id: smartLock.group_id } });
    if (!smartLockGroup) {
        return {
            status: 'failed',
            message: 'Smart lock group does not exist.',
            data: {}
        };
    }
    if (smartLockGroup.name !== businessType) {
        return {
            status: 'failed',
            message: 'Smart lock does not belong to this business type.',
            data: {}
        };
    }
    const [userAccess, created] = yield UserSmartLockAccess_1.UserSmartLockAccess.upsert({
        user_id: userToGrant.id,
        smart_lock_id: smartLock.id,
        granted_by_id: requestUser.id,
        room_id: room.id,
        period: period
    });
    return {
        status: 'success',
        message: 'Access granted successfully.',
        data: {
            user_id: userToGrant.id,
            username: userToGrant.username,
            smart_lock: smartLock.device_id,
            room_id: room.id,
            period
        }
    };
});
exports.grantSmartLockAccessToBusiness = grantSmartLockAccessToBusiness;
const addSmartLockService = (device_id, business_type, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { id: userId } });
    if (!user) {
        return {
            statusCode: 401,
            data: {
                status: 'UnAuthorized',
                message: 'User does not exist.',
                data: {}
            }
        };
    }
    const smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { name: business_type } });
    if (!smartLockGroup) {
        return {
            statusCode: 400,
            data: {
                status: 'failed',
                message: 'Invalid input.',
                data: { business_type: [`Smart lock group with name '${business_type}' does not exist.`] }
            }
        };
    }
    var smartLock = null;
    try {
        smartLock = yield SmartLock_1.SmartLock.create({
            id: 503,
            device_id,
            group_id: smartLockGroup.id,
            created_at: new Date
        });
    }
    catch (e) {
        throw new Error(e.message);
    }
    if (!smartLock) {
        return {
            statusCode: 404,
            data: {
                status: 'failed',
                message: 'Failed to create smart lock.',
                data: {}
            }
        };
    }
    const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
    if (businessProfile) {
        yield BusinessSmartLock_1.BusinessSmartLock.findOrCreate({
            where: { id: 503, business_profile_id: businessProfile.id, smart_lock_id: smartLock.id }
        });
        return {
            statusCode: 201,
            data: {
                status: 'success',
                message: 'Smart lock added and associated with BusinessProfile successfully.',
                data: smartLock
            }
        };
    }
    else {
        yield UserSmartLockAccess_1.UserSmartLockAccess.findOrCreate({
            where: { user_id: userId, smart_lock_id: smartLock.id }
        });
        return {
            statusCode: 201,
            data: {
                status: 'success',
                message: 'Smart lock added and associated with UserSmartLockAccess successfully.',
                data: smartLock
            }
        };
    }
});
exports.addSmartLockService = addSmartLockService;
