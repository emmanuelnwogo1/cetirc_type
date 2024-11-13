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
const UserProfile_1 = require("../models/UserProfile");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/User");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userProfile = yield UserProfile_1.UserProfile.create(req.body);
        return res.status(201).json({
            status: 'success',
            message: 'UserProfile created successfully',
            data: userProfile,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to create userprofile',
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
                { '$user.first_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                { '$user.last_name$': { [sequelize_1.Op.iLike]: `%${q}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${q}%` } },
            ],
        }
        : {};
    try {
        const { rows: userProfiles, count: totalUserProfiles } = yield UserProfile_1.UserProfile.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['first_name', 'last_name'],
                },
            ],
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalUserProfiles / limitNumber);
        if (!userProfiles.length) {
            return res.status(200).json({
                status: 'success',
                message: 'No userprofiles found on this page',
                data: {
                    userProfiles: [],
                    pagination: {
                        total: totalUserProfiles,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
        else {
            const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = process.env.PLACEHOLDER_IMAGE;
            const users = userProfiles.map(function (userProfile) {
                userProfile.image = userProfile.image ? `${serverUrl}/api/${userProfile.image}` : defaultImageUrl;
                return userProfile;
            });
            return res.json({
                status: 'success',
                message: 'UserProfile retrieved successfully',
                data: {
                    userProfiles: users,
                    pagination: {
                        total: totalUserProfiles,
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
            message: 'Failed to retrieve userprofiles',
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
        var userProfile = yield UserProfile_1.UserProfile.findByPk(req.params.id);
        if (!userProfile) {
            return res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }
        else {
            const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;
            userProfile.image = userProfile.image
                ? `${serverUrl}/api/${userProfile.image}`
                : defaultImageUrl;
            return res.json({
                status: 'success',
                message: 'UserProfile retrieved successfully',
                data: userProfile,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve userprofile',
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
        const userId = parseFloat(req.params.id);
        const [updated] = yield UserProfile_1.UserProfile.update(req.body, {
            where: { id: userId },
        });
        if (updated > 0) {
            const updatedUser = yield UserProfile_1.UserProfile.findByPk(userId);
            res.json({
                status: 'success',
                message: 'UserProfile updated successfully',
                data: updatedUser,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update userprofile',
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
        const deleted = yield UserProfile_1.UserProfile.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'UserProfile deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete userprofile',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
const upload = (0, multer_1.default)({ dest: 'images/' });
router.patch('/:id/image', authMiddleware_1.default, adminMiddleware_1.default, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = req.file;
        const userId = parseInt(req.params.id);
        if (!image || !image.path || !userId) {
            return res.status(404).json({
                status: 'failed',
                message: 'No image or user provided.',
                data: null,
            });
        }
        const imageBuffer = yield fs_1.default.promises.readFile(image.path);
        let profile = yield UserProfile_1.UserProfile.findOne({
            where: { id: userId },
        });
        if (!profile) {
            return res.status(404).json({
                status: 'failed',
                message: 'UserProfile not found',
                data: null,
            });
        }
        const fileExtension = path_1.default.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `image_${timestamp}${fileExtension}`;
        const imagePath = path_1.default.join(__dirname, '../../images/', imageName);
        yield fs_1.default.promises.writeFile(imagePath, imageBuffer);
        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/images/${imageName}`;
        profile.image = `images/${imageName}`;
        yield profile.save();
        return res.status(200).json({
            status: 'success',
            message: 'Profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while updating the profile photo.',
            data: { error: error.message || 'Unknown error' },
        });
    }
}));
exports.default = router;
