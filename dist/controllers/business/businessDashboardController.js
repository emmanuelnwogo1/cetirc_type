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
exports.updateDashboardController = exports.businessDashboardController = void 0;
const businessDashboardService_1 = require("../../services/business/businessDashboardService");
const businessDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const dashboardData = yield (0, businessDashboardService_1.getBusinessDashboard)(userId);
        res.status(200).json({
            status: 'success',
            message: 'Operation completed successfully.',
            data: dashboardData,
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            status: 'failed',
            message: error.message || 'An unexpected error occurred.',
            data: {},
        });
    }
});
exports.businessDashboardController = businessDashboardController;
const updateDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const data = req.body;
        const updatedData = yield (0, businessDashboardService_1.updateBusinessDashboard)(userId, data);
        res.status(200).json({
            status: 'success',
            message: 'Business dashboard updated successfully.',
            data: updatedData,
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            status: 'failed',
            message: error.message || 'An unexpected error occurred.',
            data: {},
        });
    }
});
exports.updateDashboardController = updateDashboardController;
