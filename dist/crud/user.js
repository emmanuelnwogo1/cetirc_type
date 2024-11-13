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
const User_1 = require("../models/User");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const BusinessProfile_1 = require("../models/BusinessProfile");
const BusinessDashboard_1 = require("../models/BusinessDashboard");
const UserProfile_1 = require("../models/UserProfile");
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const requiredFields = User_1.User.getAttributes();
    const missingFields = Object.keys(requiredFields)
        .filter((field) => requiredFields[field].allowNull === false && !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 'failed',
            message: 'Validation error',
            data: {
                errors: missingFields.map(field => ({
                    message: `${field} is required`
                }))
            },
        });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield User_1.User.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create user',
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
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    const whereClause = q
        ? {
            [sequelize_1.Op.or]: [
                { username: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { first_name: { [sequelize_1.Op.iLike]: `%${q}%` } },
                { last_name: { [sequelize_1.Op.iLike]: `%${q}%` } },
            ],
        }
        : {};
    try {
        const { rows: users, count: totalUsers } = yield User_1.User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserProfile_1.UserProfile,
                    attributes: ['image'],
                }
            ],
            offset,
            limit: limitNumber,
        });
        const serverUrl = process.env.SERVER_URL;
        const defaultImageUrl = process.env.PLACEHOLDER_IMAGE;
        const usersWithFullImageUrl = users.map(user => {
            var _a;
            const imageUrl = ((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.image)
                ? `${serverUrl}/api/${user.userProfile.image}`
                : defaultImageUrl;
            return Object.assign(Object.assign({}, user.toJSON()), { userProfile: Object.assign(Object.assign({}, user.userProfile), { image: imageUrl }) });
        });
        const totalPages = Math.ceil(totalUsers / limitNumber);
        if (!usersWithFullImageUrl.length) {
            return res.status(200).json({
                status: 'success',
                message: 'No users found on this page',
                data: {
                    users: [],
                    pagination: {
                        total: totalUsers,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        }
        return res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: {
                users: usersWithFullImageUrl,
                pagination: {
                    total: totalUsers,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages,
                },
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve users',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.code}`,
            },
        });
    }
}));
router.get('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const serverUrl = process.env.SERVER_URL;
        const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;
        const user = yield User_1.User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserProfile_1.UserProfile,
                    attributes: ['image'],
                }
            ]
        });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                data: null,
            });
        }
        if (user === null || user === void 0 ? void 0 : user.userProfile) {
            user.userProfile.image = user.userProfile.image
                ? `${serverUrl}/api/${user.userProfile.image}`
                : defaultImageUrl;
        }
        return res.json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve user',
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
        const updateData = Object.assign({}, req.body);
        if (req.body.password) {
            updateData.password = yield bcrypt_1.default.hash(req.body.password, 10);
        }
        const [updated] = yield User_1.User.update(updateData, {
            where: { id: userId },
        });
        if (updated > 0) {
            const updatedUser = yield User_1.User.findByPk(userId, {
                attributes: { exclude: ['password'] },
            });
            res.json({
                status: 'success',
                message: 'User updated successfully',
                data: updatedUser,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'User not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update user',
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
        const businessProfile = yield BusinessProfile_1.BusinessProfile.findOne({
            where: {
                user_id: req.params.id
            }
        });
        const userProfile = yield UserProfile_1.UserProfile.findOne({
            where: {
                username_id: req.params.id
            }
        });
        if (businessProfile) {
            const businessDashboard = yield BusinessDashboard_1.BusinessDashboard.findOne({
                where: {
                    business_id: businessProfile.id
                }
            });
            if (businessDashboard) {
                businessDashboard.destroy();
            }
            businessProfile.destroy();
        }
        if (userProfile) {
            userProfile.destroy();
        }
        const deleted = yield User_1.User.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            return res.status(200).json({
                status: 'success',
                message: 'User deleted successfully',
                data: null,
            });
        }
        else {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                data: null,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to delete user',
            data: {
                errors: (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) !== null && _b !== void 0 ? _b : `Error code: ${(_c = error.parent) === null || _c === void 0 ? void 0 : _c.detail}`,
            },
        });
    }
}));
exports.default = router;
