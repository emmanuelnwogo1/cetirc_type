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
const Room_1 = require("../models/Room");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const SmartLockGroup_1 = require("../models/SmartLockGroup");
const SmartLock_1 = require("../models/SmartLock");
const BusinessSmartLock_1 = require("../models/BusinessSmartLock");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const room = yield Room_1.Room.create(Object.assign({}, req.body));
        res.status(201).json({
            status: 'success',
            message: 'Room created successfully',
            data: room,
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
                    { name: { [sequelize_1.Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
        const { rows: rooms, count: totalRooms } = yield Room_1.Room.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalRooms / limitNumber);
        if (!rooms.length) {
            res.status(200).json({
                status: 'success',
                message: 'No rooms found on this page',
                data: {
                    rooms: [],
                    pagination: {
                        total: totalRooms,
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
                message: 'Room retrieved successfully',
                data: {
                    rooms,
                    pagination: {
                        total: totalRooms,
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
            message: 'Failed to retrieve rooms',
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
        const room = yield Room_1.Room.findByPk(req.params.id);
        if (!room) {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        }
        else {
            res.json({
                status: 'success',
                message: 'Room retrieved successfully',
                data: room,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve room',
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
        const roomId = parseFloat(req.params.id);
        const [updated] = yield Room_1.Room.update(req.body, {
            where: { id: roomId },
        });
        if (updated > 0) {
            const updatedRoom = yield Room_1.Room.findByPk(roomId);
            res.json({
                status: 'success',
                message: 'Room updated successfully',
                data: updatedRoom,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update room',
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
        // Step 1: Find the Room by its ID
        const room = yield Room_1.Room.findByPk(req.params.id);
        if (!room) {
            res.status(404).json({
                status: 'failed',
                message: 'Room not found',
                data: null,
            });
        }
        else {
            const groupId = room.group_id;
            // Step 2: Find associated Smart Lock for the Room
            const smartLock = yield SmartLock_1.SmartLock.findOne({
                where: {
                    room_id: room.id,
                    group_id: groupId
                }
            });
            if (!smartLock) {
                res.status(404).json({
                    status: 'failed',
                    message: 'Smart lock not found for the room',
                    data: null,
                });
            }
            else {
                // Step 3: Delete related BusinessSmartLock records
                yield BusinessSmartLock_1.BusinessSmartLock.destroy({
                    where: { smart_lock_id: smartLock.id }
                });
                // Step 4: Delete the SmartLock itself
                yield SmartLock_1.SmartLock.destroy({
                    where: { id: smartLock.id }
                });
                // Step 5: Delete the SmartLockGroup
                yield SmartLockGroup_1.SmartLockGroup.destroy({
                    where: { id: groupId }
                });
                // Step 6: Delete the Room
                yield Room_1.Room.destroy({
                    where: { id: req.params.id }
                });
                // Final Response
                res.status(200).json({
                    status: 'success',
                    message: 'Room and associated records deleted successfully',
                    data: null,
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete room and associated records',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.detail}`,
            },
        });
    }
}));
exports.default = router;
