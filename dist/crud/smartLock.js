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
const SmartLock_1 = require("../models/SmartLock");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const SmartLockGroup_1 = require("../models/SmartLockGroup");
const Room_1 = require("../models/Room");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const smartLock = yield SmartLock_1.SmartLock.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'SmartLock created successfully',
            data: smartLock,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create smartlock',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.detail}`,
            },
        });
    }
}));
// Read all with optional search
router.get('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { q, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    const whereClause = q
        ? {
            [sequelize_1.Op.or]: [
                { name: { [sequelize_1.Op.iLike]: `%${q}%` } },
                {
                    '$smartLockGroup.name$': { [sequelize_1.Op.iLike]: `%${q}%` },
                },
                {
                    '$room.name$': { [sequelize_1.Op.iLike]: `%${q}%` },
                },
            ],
        }
        : {};
    try {
        const { rows: smartLocks, count: totalSmartLocks } = yield SmartLock_1.SmartLock.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: SmartLockGroup_1.SmartLockGroup,
                    as: 'smartLockGroup',
                    required: false,
                    attributes: ['name'],
                },
                {
                    model: Room_1.Room,
                    as: 'room',
                    required: false,
                    attributes: ['name'],
                },
            ],
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalSmartLocks / limitNumber);
        if (!smartLocks.length) {
            res.status(200).json({
                status: 'success',
                message: 'No smart locks found on this page',
                data: {
                    smartLocks: [],
                    pagination: {
                        total: totalSmartLocks,
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
                message: 'SmartLocks retrieved successfully',
                data: {
                    smartLocks,
                    pagination: {
                        total: totalSmartLocks,
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
            message: 'Failed to retrieve smart locks',
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
        const smartLock = yield SmartLock_1.SmartLock.findByPk(req.params.id);
        if (!smartLock) {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLock not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'SmartLock retrieved successfully',
                data: smartLock,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve smartlock',
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
        const smartLockId = parseFloat(req.params.id);
        const [updated] = yield SmartLock_1.SmartLock.update(req.body, {
            where: { id: smartLockId },
        });
        if (updated > 0) {
            const updatedSmartLock = yield SmartLock_1.SmartLock.findByPk(smartLockId);
            res.json({
                status: 'success',
                message: 'SmartLock updated successfully',
                data: updatedSmartLock,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLock not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update smartlock',
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
        const deleted = yield SmartLock_1.SmartLock.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'SmartLock deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLock not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete smartlock',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
exports.default = router;
