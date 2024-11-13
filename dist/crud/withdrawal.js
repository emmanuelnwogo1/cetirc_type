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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Withdrawal_1 = require("../models/Withdrawal");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const withdrawal = yield Withdrawal_1.Withdrawal.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Withdrawal created successfully',
            data: withdrawal,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create withdrawal',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${error.parent.code}`,
            },
        });
    }
}));
// Read all with optional search
router.get('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { q, page = 1, limit = 10 } = req.query;
    try {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;
        const whereClause = q
            ? {
                withdraw_code: { [sequelize_1.Op.like]: `%${q}%` },
            }
            : {};
        const { rows: withdrawals, count: totalWithdrawals } = yield Withdrawal_1.Withdrawal.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalWithdrawals / limitNumber);
        if (!withdrawals.length) {
            res.status(200).json({
                status: 'success',
                message: 'No withdrawals found on this page',
                data: {
                    withdrawals: [],
                    pagination: {
                        total: totalWithdrawals,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'Withdrawal retrieved successfully',
                data: {
                    withdrawals,
                    pagination: {
                        total: totalWithdrawals,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve withdrawals',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${error.parent.code}`,
            },
        });
    }
}));
// Read one
router.get('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const withdrawal = yield Withdrawal_1.Withdrawal.findByPk(req.params.id);
        if (!withdrawal) {
            res.status(404).json({
                status: 'failed',
                message: 'Withdrawal not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'Withdrawal retrieved successfully',
                data: withdrawal,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve withdrawal',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${error.parent.code}`,
            },
        });
    }
}));
// Update
router.put('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const withdrawalId = parseFloat(req.params.id);
        const [updated] = yield Withdrawal_1.Withdrawal.update(req.body, {
            where: { id: withdrawalId },
        });
        if (updated > 0) {
            const updatedWithdrawal = yield Withdrawal_1.Withdrawal.findByPk(withdrawalId);
            res.json({
                status: 'success',
                message: 'Withdrawal updated successfully',
                data: updatedWithdrawal,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'Withdrawal not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update withdrawal',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${error.parent.code}`,
            },
        });
    }
}));
// Delete
router.delete('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const deleted = yield Withdrawal_1.Withdrawal.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'Withdrawal deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'Withdrawal not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete withdrawal',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${error.parent.code}`,
            },
        });
    }
}));
exports.default = router;
