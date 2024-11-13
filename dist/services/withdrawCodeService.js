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
exports.getWithdrawCode = void 0;
const BusinessProfile_1 = require("../models/BusinessProfile");
const getWithdrawCode = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
        if (!businessProfile) {
            return {
                statusCode: 404,
                status: "failed",
                message: "Business profile not found.",
                data: {}
            };
        }
        const withdrawCode = businessProfile.withdraw_code;
        return {
            statusCode: 200,
            status: "success",
            message: "Withdraw code retrieved successfully.",
            data: {
                withdraw_code: withdrawCode
            }
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            status: "failed",
            message: "An error occurred while retrieving the withdraw code.",
            data: {}
        };
    }
});
exports.getWithdrawCode = getWithdrawCode;
