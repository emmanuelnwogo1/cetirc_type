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
const BusinessSmartLock_1 = require("../models/BusinessSmartLock");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const BusinessProfile_1 = require("../models/BusinessProfile");
const SmartLockGroup_1 = require("../models/SmartLockGroup");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const businessSmartLock = yield BusinessSmartLock_1.BusinessSmartLock.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'BusinessSmartLock created successfully',
            data: businessSmartLock,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create businesssmartlock',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.detail}`,
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
                    { '$businessProfile.name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$businessProfile.email$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$businessType.name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { '$businessType.description$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                ]
            }
            : {};
        const { rows: businessSmartLocks, count: totalBusinessSmartLocks } = yield BusinessSmartLock_1.BusinessSmartLock.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: BusinessProfile_1.BusinessProfile,
                    as: 'businessProfile',
                    attributes: ['name'],
                },
                {
                    model: SmartLockGroup_1.SmartLockGroup,
                    as: 'businessType',
                    attributes: ['name', 'description'],
                }
            ],
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalBusinessSmartLocks / limitNumber);
        if (!businessSmartLocks.length) {
            return res.status(200).json({
                status: 'success',
                message: 'No business smart locks found on this page',
                data: {
                    businessSmartLocks: [],
                    pagination: {
                        total: totalBusinessSmartLocks,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
        else {
            return res.json({
                status: 'success',
                message: 'Business smart locks retrieved successfully',
                data: {
                    businessSmartLocks,
                    pagination: {
                        total: totalBusinessSmartLocks,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: error,
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.detail}`,
            },
        });
    }
}));
// Read one
router.get('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const businessSmartLock = yield BusinessSmartLock_1.BusinessSmartLock.findByPk(req.params.id);
        if (!businessSmartLock) {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessSmartLock not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'BusinessSmartLock retrieved successfully',
                data: businessSmartLock,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve businesssmartlock',
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
        const businessSmartLockId = parseFloat(req.params.id);
        const [updated] = yield BusinessSmartLock_1.BusinessSmartLock.update(req.body, {
            where: { id: businessSmartLockId },
        });
        if (updated > 0) {
            const updatedUser = yield BusinessSmartLock_1.BusinessSmartLock.findByPk(businessSmartLockId);
            res.json({
                status: 'success',
                message: 'BusinessSmartLock updated successfully',
                data: updatedUser,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessSmartLock not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update businesssmartlock',
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
        const deleted = yield BusinessSmartLock_1.BusinessSmartLock.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'BusinessSmartLock deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessSmartLock not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete businesssmartlock',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
exports.default = router;
