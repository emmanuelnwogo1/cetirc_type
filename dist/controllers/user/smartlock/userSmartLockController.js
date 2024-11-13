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
const userSmartLockService_1 = __importDefault(require("../../../services/user/smartlock/userSmartLockService"));
const smartLockControlService_1 = require("../../../services/user/smartlock/smartLockControlService");
const userSmartLockGroupService_1 = require("../../../services/user/smartlock/userSmartLockGroupService");
class UserSmartLockController {
    constructor() {
        this.leaveSmartLockGroupController = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { smart_lock_device_id } = req.body;
                const response = yield (0, userSmartLockGroupService_1.leaveSmartLockGroup)(userId, smart_lock_device_id);
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
    }
    userSmartLockSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { device_id, group_name } = req.body;
            const userId = req.user.id;
            try {
                const response = yield userSmartLockService_1.default.userSmartLockSignUp(device_id, group_name, userId);
                res.status(201).json(response);
            }
            catch (error) {
                res.status(404).json({
                    status: 'failed',
                    message: 'Invalid input.',
                    data: {
                        non_field_errors: [error.message]
                    }
                });
            }
        });
    }
    controlSmartLock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const { action, deviceId } = req.params;
            try {
                const result = yield (0, smartLockControlService_1.controlSmartLock)(userId, action, deviceId);
                res.status(200).json(result);
            }
            catch (error) {
                const statusCode = error.message.includes('not found') ? 404 : 403;
                res.status(statusCode).json({
                    status: 'failed',
                    message: error.message,
                    data: {},
                });
            }
        });
    }
    getUserSmartLockGroupsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            try {
                const result = yield (0, userSmartLockGroupService_1.getUserSmartLockGroups)(userId);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    status: 'failed',
                    message: 'An error occurred while retrieving smart locks.',
                    data: {},
                });
            }
        });
    }
    removeUserFromSmartLockGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, smart_lock_device_id } = req.body;
            try {
                const result = yield userSmartLockService_1.default.removeUserFromSmartLockGroup(user_id, smart_lock_device_id);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({
                    status: 'failed',
                    message: error.message,
                    data: {},
                });
            }
        });
    }
}
exports.default = new UserSmartLockController();
