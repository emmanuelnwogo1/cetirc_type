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
const SmartLockGroup_1 = require("../models/SmartLockGroup");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const SmartLock_1 = require("../models/SmartLock");
const UserSmartLockAccess_1 = require("../models/UserSmartLockAccess");
const Room_1 = require("../models/Room");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'SmartLockGroup created successfully',
            data: smartLockGroup,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create smart lock group.',
            data: {
                errors: (_d = (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`) !== null && _d !== void 0 ? _d : (_e = error.parent) === null || _e === void 0 ? void 0 : _e.detail,
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
                    { name: { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { description: { [sequelize_1.Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
        const { rows: smartLockGroups, count: totalSmartLockGroups } = yield SmartLockGroup_1.SmartLockGroup.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalSmartLockGroups / limitNumber);
        if (!smartLockGroups.length) {
            res.status(200).json({
                status: 'success',
                message: 'No smartlockgroups found on this page',
                data: {
                    smartLockGroups: [],
                    pagination: {
                        total: totalSmartLockGroups,
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
                message: 'SmartLockGroup retrieved successfully',
                data: {
                    smartLockGroups,
                    pagination: {
                        total: totalSmartLockGroups,
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
            message: 'Failed to retrieve smartlockgroups',
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
        const smartLockGroup = yield SmartLockGroup_1.SmartLockGroup.findByPk(req.params.id);
        if (!smartLockGroup) {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLockGroup not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'SmartLockGroup retrieved successfully',
                data: smartLockGroup,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve smartlockgroup',
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
        const smartLockGroupId = parseFloat(req.params.id);
        const [updated] = yield SmartLockGroup_1.SmartLockGroup.update(req.body, {
            where: { id: smartLockGroupId },
        });
        if (updated > 0) {
            const updatedSmartLockGroup = yield SmartLockGroup_1.SmartLockGroup.findByPk(smartLockGroupId);
            res.json({
                status: 'success',
                message: 'SmartLockGroup updated successfully',
                data: updatedSmartLockGroup,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLockGroup not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update smartlockgroup',
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
        const smartLocks = yield SmartLock_1.SmartLock.findAll({
            where: {
                group_id: req.params.id
            }
        });
        if (smartLocks.length > 0) {
            const smartLockIds = smartLocks.map(smartLock => smartLock.id);
            yield UserSmartLockAccess_1.UserSmartLockAccess.destroy({
                where: {
                    smart_lock_id: {
                        [sequelize_1.Op.in]: smartLockIds
                    }
                }
            });
            for (const smartLock of smartLocks) {
                yield smartLock.destroy();
            }
        }
        //delete rooms
        yield Room_1.Room.destroy({
            where: {
                group_id: req.params.id
            }
        });
        const deleted = yield SmartLockGroup_1.SmartLockGroup.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'SmartLockGroup deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'SmartLockGroup not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete smartlockgroup',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.detail}`,
            },
        });
    }
}));
exports.default = router;
