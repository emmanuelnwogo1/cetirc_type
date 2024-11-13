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
exports.getTransactionHistory = exports.linkPalm = exports.requestPayment = void 0;
const Transaction_1 = require("../../models/Transaction");
const requestPayment = (amount, businessId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield Transaction_1.Transaction.create({
            amount: amount,
            business_id: businessId,
            success: false
        });
        return {
            status: "success",
            message: "Transaction record created.",
            data: {
                transaction_id: transaction.id,
                amount: transaction.amount,
                success: transaction.success
            }
        };
    }
    catch (error) {
        return {
            status: "failed",
            message: error.message || "Failed to create payment request.",
            data: {}
        };
    }
});
exports.requestPayment = requestPayment;
const linkPalm = (user_id, card_id, palm_scan_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return { linkId: 'link_12345', user_id, card_id };
    }
    catch (error) {
        throw new Error('Failed to link palm: ' + error.message);
    }
});
exports.linkPalm = linkPalm;
const getTransactionHistory = (user_id, business_id, date_range) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return [{ transactionId: 'txn_12345', user_id, business_id, amount: 100.0 }];
    }
    catch (error) {
        throw new Error('Failed to retrieve transaction history: ' + error.message);
    }
});
exports.getTransactionHistory = getTransactionHistory;
