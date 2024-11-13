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
const PasswordResetRequest_1 = require("../models/PasswordResetRequest");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const passwordResetRequest = yield PasswordResetRequest_1.PasswordResetRequest.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'PasswordResetRequest created successfully',
            data: passwordResetRequest,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error,
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
                    { '$user.email$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$user.first_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
        const { rows: passwordResetRequests, count: totalPasswordResetRequests } = yield PasswordResetRequest_1.PasswordResetRequest.findAndCountAll({
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
        const totalPages = Math.ceil(totalPasswordResetRequests / limitNumber);
        if (!passwordResetRequests.length) {
            res.status(200).json({
                status: 'success',
                message: 'No passwordresetrequests found on this page',
                data: {
                    passwordResetRequests: [],
                    pagination: {
                        total: totalPasswordResetRequests,
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
                message: 'PasswordResetRequest retrieved successfully',
                data: {
                    passwordResetRequests,
                    pagination: {
                        total: totalPasswordResetRequests,
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
            message: error,
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
        const passwordResetRequest = yield PasswordResetRequest_1.PasswordResetRequest.findByPk(req.params.id);
        if (!passwordResetRequest) {
            res.status(404).json({
                status: 'failed',
                message: 'PasswordResetRequest not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'PasswordResetRequest retrieved successfully',
                data: passwordResetRequest,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve passwordresetrequest',
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
        const passwordResetRequestId = parseFloat(req.params.id);
        const [updated] = yield PasswordResetRequest_1.PasswordResetRequest.update(req.body, {
            where: { id: passwordResetRequestId },
        });
        if (updated > 0) {
            const updatedUser = yield PasswordResetRequest_1.PasswordResetRequest.findByPk(passwordResetRequestId);
            res.json({
                status: 'success',
                message: 'PasswordResetRequest updated successfully',
                data: updatedUser,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'PasswordResetRequest not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update passwordresetrequest',
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
        const deleted = yield PasswordResetRequest_1.PasswordResetRequest.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'PasswordResetRequest deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'PasswordResetRequest not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete passwordresetrequest',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
exports.default = router;
