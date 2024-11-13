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
exports.updateBusinessDashboard = exports.getBusinessDashboard = void 0;
const BusinessDashboard_1 = require("../../models/BusinessDashboard");
const BusinessProfile_1 = require("../../models/BusinessProfile");
const http_errors_1 = require("http-errors");
const getBusinessDashboard = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
    if (!businessProfile) {
        throw new http_errors_1.NotFound('BusinessProfile does not exist');
    }
    const dashboardData = yield BusinessDashboard_1.BusinessDashboard.findOne({ where: { business_id: businessProfile.id } });
    if (!dashboardData) {
        throw new http_errors_1.NotFound('BusinessDashboard does not exist');
    }
    return dashboardData;
});
exports.getBusinessDashboard = getBusinessDashboard;
const updateBusinessDashboard = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({ where: { user_id: userId } });
    if (!businessProfile) {
        throw new http_errors_1.NotFound('BusinessProfile does not exist');
    }
    const [dashboardData] = yield BusinessDashboard_1.BusinessDashboard.upsert(Object.assign(Object.assign({}, data), { businessId: businessProfile.id }));
    return dashboardData;
});
exports.updateBusinessDashboard = updateBusinessDashboard;
