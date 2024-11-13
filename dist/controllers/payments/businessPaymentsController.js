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
exports.linkPalmController = exports.processPaymentController = exports.requestPaymentController = void 0;
const businessPaymentsService_1 = require("../../services/payments/businessPaymentsService");
const businessPaymentsProcessingService_1 = require("../../services/payments/businessPaymentsProcessingService");
const requestPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, business_id } = req.body;
    if (!amount || !business_id) {
        return res.status(400).json({
            status: "failed",
            message: "Missing required parameters (amount or business_id).",
            data: {}
        });
    }
    try {
        const result = yield (0, businessPaymentsService_1.requestPayment)(amount, business_id);
        if (result.success) {
            return res.status(200).json({
                status: "success",
                message: "Transaction record created.",
                data: {
                    transaction_id: result.transaction_id,
                    amount: result.amount,
                    status: result.status
                }
            });
        }
        return res.status(500).json({
            status: "failed",
            message: result.error || "Failed to create payment request.",
            data: {}
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message || "Server error while processing the request.",
            data: {}
        });
    }
});
exports.requestPaymentController = requestPaymentController;
const processPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, amount, transaction_id } = req.body;
        if (!user_id || !amount) {
            return res.status(400).json({
                status: "failed",
                message: "User ID, payment method, and amount are required.",
                data: {}
            });
        }
        const data = yield (0, businessPaymentsProcessingService_1.processPayment)(user_id, amount, transaction_id);
        if (data.status === 'success') {
            return res.status(200).json(data);
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message || "Error processing the payment.",
            data: {}
        });
    }
});
exports.processPaymentController = processPaymentController;
const linkPalmController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, card_id, palm_scan_data } = req.body;
        if (!user_id || !card_id || !palm_scan_data) {
            return res.status(400).json({
                status: "failed",
                message: "User ID, card ID, and palm scan data are required.",
                data: {}
            });
        }
        const data = yield (0, businessPaymentsService_1.linkPalm)(user_id, card_id, palm_scan_data);
        return res.status(200).json({
            status: "success",
            message: "Palm linked successfully.",
            data
        });
    }
    catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message || "Error linking palm scan.",
            data: {}
        });
    }
});
exports.linkPalmController = linkPalmController;
