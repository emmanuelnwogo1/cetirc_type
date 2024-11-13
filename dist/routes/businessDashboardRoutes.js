"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessDashboardController_1 = require("../controllers/business/businessDashboardController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.get('/business_dashboard/', authMiddleware_1.default, businessDashboardController_1.businessDashboardController);
router.post('/business_dashboard/', authMiddleware_1.default, businessDashboardController_1.updateDashboardController);
exports.default = router;
