"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const palmShareController_1 = require("../controllers/palmShareController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.post('/palm_share', authMiddleware_1.default, palmShareController_1.palmShareController);
router.get('/palmshare/members/', authMiddleware_1.default, palmShareController_1.palmShareMemmebersController);
router.put('/palmshare/members/:allowed_username', authMiddleware_1.default, palmShareController_1.palmShareUpdateMemberController);
router.delete('/palmshare/members/remove/:allowedUsername', authMiddleware_1.default, palmShareController_1.deletePalmShareMemberController);
router.get('/palmshare/search/', authMiddleware_1.default, palmShareController_1.searchPalmShareController);
exports.default = router;
