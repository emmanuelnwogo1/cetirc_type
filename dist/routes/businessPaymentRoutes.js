"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businessPaymentsController_1 = require("../controllers/payments/businessPaymentsController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/businessprofiles/payments/request', authMiddleware_1.default, businessPaymentsController_1.requestPaymentController);
router.post('/businessprofiles/payments/process', authMiddleware_1.default, businessPaymentsController_1.processPaymentController);
router.post('/users/link_palm', authMiddleware_1.default, businessPaymentsController_1.linkPalmController);
exports.default = router;
