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
const PalmShare_1 = require("../models/PalmShare");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const palmShare = yield PalmShare_1.PalmShare.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'PalmShare created successfully',
            data: palmShare,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create palmshare',
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
                    { '$owner.first_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$owner.last_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$owner.email$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$allowedUser.first_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$allowedUser.last_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$allowedUser.email$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
        const { rows: palmShares, count: totalPalmShares } = yield PalmShare_1.PalmShare.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User_1.User,
                    as: 'owner',
                    attributes: ['first_name', 'last_name', 'email'],
                },
                {
                    model: User_1.User,
                    as: 'allowedUser',
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalPalmShares / limitNumber);
        if (!palmShares.length) {
            res.status(200).json({
                status: 'success',
                message: 'No palmshares found on this page',
                data: {
                    palmShares: [],
                    pagination: {
                        total: totalPalmShares,
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
                message: 'PalmShare retrieved successfully',
                data: {
                    palmShares,
                    pagination: {
                        total: totalPalmShares,
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
            message: 'Failed to retrieve palmshares',
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
        const palmShare = yield PalmShare_1.PalmShare.findByPk(req.params.id);
        if (!palmShare) {
            res.status(404).json({
                status: 'failed',
                message: 'PalmShare not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'PalmShare retrieved successfully',
                data: palmShare,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve palmshare',
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
        const palmShareId = parseFloat(req.params.id);
        const [updated] = yield PalmShare_1.PalmShare.update(req.body, {
            where: { id: palmShareId },
        });
        if (updated > 0) {
            const updatedUser = yield PalmShare_1.PalmShare.findByPk(palmShareId);
            res.json({
                status: 'success',
                message: 'PalmShare updated successfully',
                data: updatedUser,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'PalmShare not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update palmshare',
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
        const deleted = yield PalmShare_1.PalmShare.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'PalmShare deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'PalmShare not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete palmshare',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
exports.default = router;
