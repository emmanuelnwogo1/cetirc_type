"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userSmartLockController_1 = __importDefault(require("../controllers/user/smartlock/userSmartLockController"));
const router = (0, express_1.Router)();
router.post('/user-smart-lock-signup/', authMiddleware_1.default, userSmartLockController_1.default.userSmartLockSignUp);
router.post('/smart-lock-control/:action/:deviceId', authMiddleware_1.default, userSmartLockController_1.default.controlSmartLock);
router.get('/user-smart-lock-groups', authMiddleware_1.default, userSmartLockController_1.default.getUserSmartLockGroupsController);
router.post('/remove-user-from-smart-lock-group', authMiddleware_1.default, userSmartLockController_1.default.removeUserFromSmartLockGroup);
router.post('/leave-smart-lock-group', authMiddleware_1.default, userSmartLockController_1.default.leaveSmartLockGroupController);
exports.default = router;
