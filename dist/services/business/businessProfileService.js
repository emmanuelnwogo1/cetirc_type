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
exports.getBusinessProfileDetails = void 0;
const BusinessProfile_1 = require("../../models/BusinessProfile");
const getBusinessProfileDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
        if (!businessProfile) {
            return {
                status: "error",
                message: "Business profile does not exist.",
                data: {}
            };
        }
        const businessData = {
            id: businessProfile.id,
            name: businessProfile.name,
            email: businessProfile.email,
            image: businessProfile.image ? `${businessProfile.image}` : null,
            address: businessProfile.address,
            city: businessProfile.city,
            state: businessProfile.state,
            zip_code: businessProfile.zip_code,
            withdraw_code: businessProfile.withdraw_code,
            latitude: businessProfile.latitude,
            longitude: businessProfile.longitude,
            bank_name: businessProfile.bank_name,
            account_name: businessProfile.account_name,
            iban: businessProfile.iban,
            number: businessProfile.number,
            website_url: businessProfile.website_url,
            opening_hours: businessProfile.opening_hours,
            closing_hours: businessProfile.closing_hours
        };
        return {
            status: "success",
            message: "Business profile retrieved successfully.",
            data: businessData
        };
    }
    catch (error) {
        return {
            status: "error",
            message: "Failed to retrieve business profile.",
            data: error
        };
    }
});
exports.getBusinessProfileDetails = getBusinessProfileDetails;
