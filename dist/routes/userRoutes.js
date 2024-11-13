"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userController_1 = require("../controllers/user/userController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'images/' });
router.put('/user_update', authMiddleware_1.default, userController_1.editUserProfile);
router.get('/user_profile', authMiddleware_1.default, userController_1.fetchUserProfileDetails);
router.patch('/profile-photo/', authMiddleware_1.default, upload.single('image'), userController_1.updateProfilePhotoController);
exports.default = router;
