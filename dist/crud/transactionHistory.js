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
const TransactionHistory_1 = require("../models/TransactionHistory");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const transactionHistory = yield TransactionHistory_1.TransactionHistory.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'TransactionHistory created successfully',
            data: transactionHistory,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create transactionhistory',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
// Read all with optional search
router.get('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { q, page = 1, limit = 10 } = req.query;
    try {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;
        const whereClause = q
            ? {
                [sequelize_1.Op.or]: [
                    { '$user.first_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$user.email$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
        const { rows: transactionHistorys, count: totalTransactionHistorys } = yield TransactionHistory_1.TransactionHistory.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalTransactionHistorys / limitNumber);
        if (!transactionHistorys.length) {
            res.status(200).json({
                status: 'success',
                message: 'No transactionhistorys found on this page',
                data: {
                    transactionHistorys: [],
                    pagination: {
                        total: totalTransactionHistorys,
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
                message: 'TransactionHistory retrieved successfully',
                data: {
                    transactionHistorys,
                    pagination: {
                        total: totalTransactionHistorys,
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
            message: 'Failed to retrieve transactionhistorys',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
// Read one
router.get('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const transactionHistory = yield TransactionHistory_1.TransactionHistory.findByPk(req.params.id);
        if (!transactionHistory) {
            res.status(404).json({
                status: 'failed',
                message: 'TransactionHistory not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'TransactionHistory retrieved successfully',
                data: transactionHistory,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve transactionhistory',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
// Update
router.put('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const transactionHistoryId = parseFloat(req.params.id);
        const [updated] = yield TransactionHistory_1.TransactionHistory.update(req.body, {
            where: { id: transactionHistoryId },
        });
        if (updated > 0) {
            const updatedTransactionHistory = yield TransactionHistory_1.TransactionHistory.findByPk(transactionHistoryId);
            res.json({
                status: 'success',
                message: 'TransactionHistory updated successfully',
                data: updatedTransactionHistory,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'TransactionHistory not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update transactionhistory',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
// Delete
router.delete('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const deleted = yield TransactionHistory_1.TransactionHistory.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'TransactionHistory deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'TransactionHistory not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete transactionhistory',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
exports.default = router;
