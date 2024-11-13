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
exports.deleteGroupService = void 0;
const SmartLock_1 = require("../../models/SmartLock");
const SmartLockGroup_1 = require("../../models/SmartLockGroup");
const User_1 = require("../../models/User");
const deleteGroupService = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield SmartLockGroup_1.SmartLockGroup.findOne({ where: { id: groupId } });
        if (!group) {
            return {
                statusCode: 404,
                status: 'failed',
                message: 'SmartLockGroup not found.',
            };
        }
        const hasPermission = yield userHasPermission(userId, groupId);
        if (!hasPermission) {
            return {
                statusCode: 403,
                status: 'failed',
                message: 'You do not have permission to delete this group.',
            };
        }
        yield SmartLock_1.SmartLock.destroy({ where: { group_id: group.id } });
        // Attempt to delete the group
        yield group.destroy();
        return {
            statusCode: 200,
            status: 'success',
            message: 'SmartLockGroup deleted successfully.',
        };
    }
    catch (error) {
        // Check for foreign key constraint error
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return {
                statusCode: 400,
                status: 'failed',
                message: 'Cannot delete SmartLockGroup as there are related child records. Please delete them first.',
            };
        }
        // Generic error handler
        return {
            statusCode: 500,
            status: 'failed',
            message: 'An error occurred while deleting the group.',
        };
    }
});
exports.deleteGroupService = deleteGroupService;
const userHasPermission = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({ where: { id: userId } });
    if (!user)
        return false;
    // Permission logic here (e.g., check if user is an admin or is associated with the group)
    return true;
});
