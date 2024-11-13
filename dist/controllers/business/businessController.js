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
exports.getNearestBusinessesController = exports.getBusinessLocation = exports.updateBusinessProfileController = exports.businessRegisterController = exports.nearbyBusinessesController = void 0;
const businessService_1 = require("../../services/business/businessService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nearbyBusinessesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userLocation = req.body.user_location;
        if (!userLocation) {
            res.status(400).json({ error: 'User location data is missing' });
            return;
        }
        const nearbyBusinesses = yield (0, businessService_1.getNearbyBusinesses)(userLocation);
        res.status(200).json({
            status: 'success',
            message: 'Nearby places fetched successfully.',
            data: {
                location: userLocation,
                places: nearbyBusinesses,
            },
        });
    }
    catch (error) {
        console.error('Error fetching nearby businesses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.nearbyBusinessesController = nearbyBusinessesController;
const businessRegisterController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businessProfile = yield (0, businessService_1.registerBusiness)(req.body);
        // Generate the access and refresh tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: businessProfile.id, email: businessProfile.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: businessProfile.id, email: businessProfile.email }, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', { expiresIn: '7d' });
        res.status(201).json({
            status: 'success',
            message: 'Business registered successfully.',
            data: {
                business_id: businessProfile.id,
                withdraw_code: businessProfile.withdraw_code,
                refresh: refreshToken,
                access: accessToken,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            status: 'failed',
            message: 'Error during registration.',
            data: {},
        });
    }
});
exports.businessRegisterController = businessRegisterController;
const updateBusinessProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessId = parseInt(req.params.business_id, 10);
    const data = req.body;
    try {
        const updatedProfile = yield (0, businessService_1.updateBusinessProfile)(businessId, data);
        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully.',
            data: updatedProfile
        });
    }
    catch (error) {
        console.error("Update failed:", error);
        res.status(error.message === "Business profile not found." ? 404 : 400).json({
            status: 'failed',
            message: error.message,
            data: {}
        });
    }
});
exports.updateBusinessProfileController = updateBusinessProfileController;
const getBusinessLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, businessService_1.getBusinessLocations)();
        res.status(result.status === 'success' ? 200 : 404).json(result);
    }
    catch (error) {
        res.status(500).json({ status: 'failed', message: 'No valid addresses found or geocoding failed for all addresses.', data: {} });
    }
});
exports.getBusinessLocation = getBusinessLocation;
const getNearestBusinessesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const location = req.body.location;
    if (!location || location.latitude == null || location.longitude == null) {
        res.status(400).json({ status: 'failed', message: 'Latitude and longitude are required.', data: {} });
    }
    try {
        const results = yield (0, businessService_1.getNearestBusinesses)(location.latitude, location.longitude);
        res.status(200).json({
            status: 'success',
            message: 'Nearest businesses retrieved successfully.',
            data: results
        });
    }
    catch (error) {
        res.status(500).json({ status: 'failed', message: 'Failed to get nearest businesses.', data: {} });
    }
});
exports.getNearestBusinessesController = getNearestBusinessesController;
