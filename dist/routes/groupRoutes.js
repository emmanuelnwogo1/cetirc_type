"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const deleteGroupController_1 = require("../controllers/group/deleteGroupController");
const smartLockGroupController_1 = require("../controllers/group/smartLockGroupController");
const router = (0, express_1.Router)();
router.delete('/delete-group/:group_id', authMiddleware_1.default, deleteGroupController_1.deleteGroupController);
router.post("/create-group", authMiddleware_1.default, smartLockGroupController_1.createGroupController);
exports.default = router;
