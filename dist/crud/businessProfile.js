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
const BusinessProfile_1 = require("../models/BusinessProfile");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middlewares/adminMiddleware"));
const sequelize_1 = require("sequelize");
const BusinessDashboard_1 = require("../models/BusinessDashboard");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Create
router.post('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const businessProfile = yield BusinessProfile_1.BusinessProfile.create(req.body);
        return res.status(201).json({
            status: 'success',
            message: 'BusinessProfile created successfully',
            data: businessProfile,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to create business profile.',
            data: {
                errors: ((_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((err) => ({
                    message: err.message,
                }))) || error.detail,
            },
        });
    }
}));
// Read all with optional search
router.get('/', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q, page = 1, limit = 10 } = req.query;
    try {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;
        const whereClause = q
            ? {
                [sequelize_1.Op.or]: [
                    { name: { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${q}%` } },
                    { address: { [sequelize_1.Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
        const { rows: businessProfiles, count: totalBusinessProfiles } = yield BusinessProfile_1.BusinessProfile.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
        const totalPages = Math.ceil(totalBusinessProfiles / limitNumber);
        if (!businessProfiles.length) {
            return res.json({
                status: 'success',
                message: 'No businessProfiles found on this page',
                data: {
                    businessProfiles: [],
                    pagination: {
                        total: totalBusinessProfiles,
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
            const businessProfilesUpdated = businessProfiles.map(function (businessProfile) {
                businessProfile.image = businessProfile.image ? `${serverUrl}/api/${businessProfile.image}` : defaultImageUrl;
                return businessProfile;
            });
            return res.json({
                status: 'success',
                message: 'BusinessProfiles retrieved successfully',
                data: {
                    businessProfiles: businessProfilesUpdated,
                    pagination: {
                        total: totalBusinessProfiles,
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
            message: 'Failed to retrieve businessProfiles',
            data: {
                errors: error.errors.map((err) => ({
                    message: err.message,
                })),
            },
        });
    }
}));
// Read one
router.get('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var businessProfile = yield BusinessProfile_1.BusinessProfile.findByPk(req.params.id);
        if (!businessProfile) {
            return res.status(404).json({
                status: 'failed',
                message: 'BusinessProfile not found',
                data: null,
            });
        }
        else {
            const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;
            businessProfile.image = businessProfile.image
                ? `${serverUrl}/api/${businessProfile.image}`
                : defaultImageUrl;
            return res.json({
                status: 'success',
                message: 'BusinessProfile retrieved successfully',
                data: businessProfile,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve businessProfile',
            data: {
                errors: error.errors.map((err) => ({
                    message: err.message,
                })),
            },
        });
    }
}));
// Update
router.put('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businessProfileId = parseFloat(req.params.id);
        const [updated] = yield BusinessProfile_1.BusinessProfile.update(req.body, {
            where: { id: businessProfileId },
        });
        if (updated > 0) {
            const updatedBusinessProfile = yield BusinessProfile_1.BusinessProfile.findByPk(businessProfileId);
            res.json({
                status: 'success',
                message: 'BusinessProfile updated successfully',
                data: updatedBusinessProfile,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessProfile not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update businessProfile',
            data: {
                errors: error.errors.map((err) => ({
                    message: err.message,
                })),
            },
        });
    }
}));
// Delete
router.delete('/:id', authMiddleware_1.default, adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessProfileId = req.params.id;
    try {
        yield BusinessDashboard_1.BusinessDashboard.destroy({
            where: { business_id: businessProfileId },
        });
        // Now, delete the BusinessProfile
        const deleted = yield BusinessProfile_1.BusinessProfile.destroy({
            where: { id: businessProfileId },
        });
        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'BusinessProfile and its associated BusinessDashboards deleted successfully',
                data: null,
            });
        }
        else {
            res.status(404).json({
                status: 'failed',
                message: 'BusinessProfile not found',
                data: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete BusinessProfile',
            data: {
                errors: error.errors.map((err) => ({
                    message: err.message,
                })),
            },
        });
    }
}));
const upload = (0, multer_1.default)({ dest: 'business_images/' });
router.patch('/:id/image', authMiddleware_1.default, adminMiddleware_1.default, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = req.file;
        const businessId = parseInt(req.params.id);
        if (!image || !image.path || !businessId) {
            return res.status(400).json({
                status: 'failed',
                message: 'No image or business ID provided.',
                data: null,
            });
        }
        const imageBuffer = yield fs_1.default.promises.readFile(image.path);
        const profile = yield BusinessProfile_1.BusinessProfile.findOne({
            where: { id: businessId },
        });
        if (!profile) {
            return res.status(404).json({
                status: 'failed',
                message: 'BusinessProfile not found',
                data: null,
            });
        }
        const fileExtension = path_1.default.extname(image.originalname) || '.png';
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const imageName = `image_${timestamp}${fileExtension}`;
        const imagePath = path_1.default.join(__dirname, '../../business_images/', imageName);
        yield fs_1.default.promises.writeFile(imagePath, imageBuffer);
        const serverUrl = process.env.SERVER_URL;
        const fullImageUrl = `${serverUrl}/api/business_images/${imageName}`;
        profile.image = `business_images/${imageName}`;
        yield profile.save();
        return res.status(200).json({
            status: 'success',
            message: 'Business profile photo updated successfully.',
            data: { image_url: fullImageUrl },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while updating the business profile photo.',
            data: { error: error.message || 'Unknown error' },
        });
    }
}));
exports.default = router;
