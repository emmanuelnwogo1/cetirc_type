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
exports.addSmartLockController = exports.grantSmartLockAccessToBusinessController = exports.fetchBusinessSmartLocks = exports.signUpBusinessSmartLockController = void 0;
const User_1 = require("../../models/User");
const businessSmartLockService_1 = require("../../services/business/businessSmartLockService");
const signUpBusinessSmartLockController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { smart_lock, business_type } = req.body;
        if (!smart_lock || !business_type) {
            res.status(400).json({
                status: 'failed',
                message: 'Invalid input.',
                data: {},
            });
        }
        const result = yield (0, businessSmartLockService_1.signUpBusinessSmartLock)(userId, smart_lock, business_type);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
            data: {},
        });
    }
});
exports.signUpBusinessSmartLockController = signUpBusinessSmartLockController;
const fetchBusinessSmartLocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const response = yield (0, businessSmartLockService_1.getBusinessSmartLocks)(userId);
        res.status(response.status === 'success' ? 200 : 404).json(response);
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred while processing your request.',
            data: error.message,
        });
    }
});
exports.fetchBusinessSmartLocks = fetchBusinessSmartLocks;
const grantSmartLockAccessToBusinessController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessType } = req.params;
    const { username, device_id, period, room_id } = req.body;
    try {
        const user = yield User_1.User.findOne({ where: { id: req.user.id } });
        const response = yield (0, businessSmartLockService_1.grantSmartLockAccessToBusiness)(user, username, device_id, period, room_id, businessType, req.user.id);
        const statusCode = response.status === 'success' ? 201 : 400;
        res.status(statusCode).json(response);
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred while granting access.',
            data: {}
        });
    }
});
exports.grantSmartLockAccessToBusinessController = grantSmartLockAccessToBusinessController;
const addSmartLockController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { device_id, business_type } = req.body;
        const userId = req.user.id;
        const result = yield (0, businessSmartLockService_1.addSmartLockService)(device_id, business_type, userId);
        res.status(result.statusCode).json(result.data);
    }
    catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error.message || 'Failed to add smart lock.',
            data: {}
        });
    }
});
exports.addSmartLockController = addSmartLockController;
