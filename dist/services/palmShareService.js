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
exports.searchPalmShare = exports.deletePalmShareMember = exports.updatePalmShareMember = exports.getPalmShareMembers = exports.savePalmShareSettings = void 0;
const sequelize_1 = require("sequelize");
const PalmShare_1 = require("../models/PalmShare");
const User_1 = require("../models/User");
const UserProfile_1 = require("../models/UserProfile");
const savePalmShareSettings = (ownerId, allowed_username, max_amount) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedUser = yield User_1.User.findOne({ where: { username: allowed_username } });
    if (!allowedUser) {
        return {
            status: 'failed',
            message: 'Allowed user does not exist.',
            data: {}
        };
    }
    const data = {
        owner_id: ownerId,
        allowed_user_id: allowedUser.id,
        max_amount: max_amount
    };
    yield PalmShare_1.PalmShare.update(data, {
        where: {
            owner_id: ownerId,
            allowed_user_id: allowedUser.id
        }
    });
    return {
        status: 'success',
        message: 'Palm Share settings saved successfully.',
        data: {
            allowed_username: allowed_username,
            max_amount: max_amount
        }
    };
});
exports.savePalmShareSettings = savePalmShareSettings;
const getPalmShareMembers = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield User_1.User.findOne({ where: { username } });
    if (!userProfile) {
        throw new Error('User profile not found');
    }
    const palmshareMembers = yield PalmShare_1.PalmShare.findAll({
        where: { owner_id: userProfile.id }
    });
    return palmshareMembers;
});
exports.getPalmShareMembers = getPalmShareMembers;
const updatePalmShareMember = (allowedUsername, user, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield User_1.User.findOne({ where: { username: user.username } });
    if (!userProfile) {
        throw new Error('User profile not found');
    }
    const allowedUser = yield User_1.User.findOne({ where: { username: allowedUsername } });
    if (!allowedUser) {
        throw new Error('Allowed user does not exist');
    }
    const palmShareMember = yield PalmShare_1.PalmShare.findOne({
        where: {
            owner_id: userProfile.id,
            allowed_user_id: allowedUser.id
        }
    });
    if (!palmShareMember) {
        throw new Error('PalmShare member does not exist');
    }
    yield palmShareMember.update(updateData);
    return palmShareMember;
});
exports.updatePalmShareMember = updatePalmShareMember;
const deletePalmShareMember = (allowedUsername, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findByPk(userId);
    if (!user)
        throw new Error('User is not authenticated.');
    const userProfile = yield UserProfile_1.UserProfile.findOne({ where: { username_id: user.id } });
    const allowedUser = yield User_1.User.findOne({ where: { username: allowedUsername } });
    if (!userProfile || !allowedUser) {
        throw new Error('PalmShare member does not exist.');
    }
    const palmShareMember = yield PalmShare_1.PalmShare.findOne({
        where: { owner_id: userProfile.id, allowed_user_id: allowedUser.id },
    });
    if (!palmShareMember)
        throw new Error('PalmShare member does not exist.');
    yield palmShareMember.destroy();
    return {
        status: 'success',
        message: 'PalmShare member removed successfully.',
        data: {},
    };
});
exports.deletePalmShareMember = deletePalmShareMember;
const searchPalmShare = (allowedUsername, dateCreated) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {};
    if (allowedUsername) {
        const users = yield User_1.User.findAll({
            where: {
                username: {
                    [sequelize_1.Op.iLike]: `%${allowedUsername}%`
                }
            }
        });
        const userIds = users.map(user => user.id);
        filters.allowed_user_id = {
            [sequelize_1.Op.in]: userIds,
        };
    }
    if (dateCreated) {
        try {
            filters.date_created = {
                [sequelize_1.Op.eq]: new Date(dateCreated),
            };
        }
        catch (error) {
            return { status: 'failed', message: 'Invalid date format. Use YYYY-MM-DD.' };
        }
    }
    const palmShares = yield PalmShare_1.PalmShare.findAll({ where: filters });
    return {
        status: 'success',
        message: 'Data retrieved successfully.',
        data: palmShares,
    };
});
exports.searchPalmShare = searchPalmShare;
