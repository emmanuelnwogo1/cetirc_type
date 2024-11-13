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
exports.getTransactionHistoryController = void 0;
const transactionHistoryService_1 = require("../../services/transaction/transactionHistoryService");
const getTransactionHistoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const transactions = yield (0, transactionHistoryService_1.getTransactionHistory)(userId);
    if (transactions.length > 0) {
        res.status(200).json({
            status: 'success',
            message: 'Transaction history retrieved successfully.',
            data: transactions,
        });
    }
    else {
        res.status(200).json({
            status: 'info',
            message: 'No transaction history available for this user.',
            data: [],
        });
    }
});
exports.getTransactionHistoryController = getTransactionHistoryController;
