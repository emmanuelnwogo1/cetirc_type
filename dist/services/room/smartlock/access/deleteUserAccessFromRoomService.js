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
exports.removeUserAccessFromRoom = void 0;
const UserSmartLockAccess_1 = require("../../../../models/UserSmartLockAccess");
const removeUserAccessFromRoom = (userId, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessRecords = yield UserSmartLockAccess_1.UserSmartLockAccess.findAll({
            where: {
                user_id: userId,
                granted_by_id: currentUser.id,
            },
        });
        if (accessRecords.length > 0) {
            const count = yield UserSmartLockAccess_1.UserSmartLockAccess.destroy({
                where: {
                    user_id: userId,
                    granted_by_id: currentUser.id,
                },
            });
            return {
                statusCode: 200,
                data: {
                    status: 'success',
                    message: `${count} access record(s) removed successfully.`,
                },
            };
        }
        else {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'No access records found for the provided user ID, or you do not have permission to delete them.',
                },
            };
        }
    }
    catch (error) {
        console.error('Error removing user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while removing user access.',
            },
        };
    }
});
exports.removeUserAccessFromRoom = removeUserAccessFromRoom;
