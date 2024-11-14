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
exports.updateUserAccess = void 0;
const UserSmartLockAccess_1 = require("../../../../models/UserSmartLockAccess");
const updateUserAccess = (userId, data, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(userId, data, currentUser);
        const accessRecord = yield UserSmartLockAccess_1.UserSmartLockAccess.findOne({
            where: { user_id: userId, granted_by_id: currentUser.id },
        });
        if (!accessRecord) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Access record not found.',
                    data: {}
                },
            };
        }
        yield accessRecord.update(data);
        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Access record updated successfully.',
                data: accessRecord,
            },
        };
    }
    catch (error) {
        console.error('Error updating user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while updating access record.',
                data: {}
            },
        };
    }
});
exports.updateUserAccess = updateUserAccess;
